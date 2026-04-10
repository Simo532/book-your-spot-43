import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { secureStorage } from '@/lib/secureStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.31:8090/api/v1';

// ─── Token Storage (uses encrypted secureStorage) ────────────────────
export const tokenStorage = {
  getAccessToken: (): string | null => secureStorage.getItem('access-token'),
  getRefreshToken: (): string | null => secureStorage.getItem('refresh-token'),
  getUserRole: (): string | null => secureStorage.getItem('user-role'),
  getUserId: (): string | null => secureStorage.getItem('user-id'),
  getDoctorOrPatientId: (): string | null => secureStorage.getItem('doctor-patient-id'),
  getUserEmail: (): string | null => secureStorage.getItem('user-email'),
  getUserFirstName: (): string | null => secureStorage.getItem('user-firstName'),
  getUserLastName: (): string | null => secureStorage.getItem('user-lastName'),
  getUserName(): string | null {
    const f = this.getUserFirstName();
    const l = this.getUserLastName();
    return f && l ? `${f} ${l}` : null;
  },

  async saveTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      secureStorage.setItem('access-token', accessToken),
      secureStorage.setItem('refresh-token', refreshToken),
    ]);
  },

  async saveUserInfo(decoded: Record<string, unknown>) {
    const promises: Promise<void>[] = [];
    if (decoded.role) promises.push(secureStorage.setItem('user-role', decoded.role as string));
    if (decoded.sub) promises.push(secureStorage.setItem('user-id', decoded.sub as string));
    if (decoded.email) promises.push(secureStorage.setItem('user-email', decoded.email as string));
    if (decoded.firstName) promises.push(secureStorage.setItem('user-firstName', decoded.firstName as string));
    if (decoded.lastName) promises.push(secureStorage.setItem('user-lastName', decoded.lastName as string));
    await Promise.all(promises);
  },

  async setDoctorOrPatientId(id: string) {
    await secureStorage.setItem('doctor-patient-id', id);
  },

  isDoctor: () => secureStorage.getItem('user-role') === 'DOCTOR',
  isPatient: () => secureStorage.getItem('user-role') === 'PATIENT',
  isAdmin: () => secureStorage.getItem('user-role') === 'ADMIN',

  isJwtExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  decodeToken(token: string): Record<string, unknown> {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  },

  clear() {
    secureStorage.clear();
  },
};

// ─── Error Message Extraction ───────────────────────────────────────
function extractErrorMessage(error: AxiosError): string {
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Please check your connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    return 'An unexpected network error occurred.';
  }

  const status = error.response.status;
  const data = error.response.data as Record<string, unknown> | string;

  // Try to extract message from response body
  if (typeof data === 'object' && data !== null) {
    const msg = data.message || data.error || data.detail;
    if (typeof msg === 'string') return msg;
  }
  if (typeof data === 'string' && data.length < 200) return data;

  // Fallback by status code
  switch (status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Session expired. Please log in again.';
    case 403: return 'You do not have permission for this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. The resource may already exist.';
    case 422: return 'Invalid data provided. Please review your input.';
    case 429: return 'Too many requests. Please wait a moment.';
    case 500: return 'Server error. Please try again later.';
    case 502: return 'Server is temporarily unavailable.';
    case 503: return 'Service is under maintenance. Please try later.';
    default: return `An error occurred (${status}).`;
  }
}

// ─── Axios Instance ──────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

// Flag to prevent multiple concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
};

// ─── Request Interceptor: Attach access token ───────────────────────
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.headers?.['X-Skip-Auth']) {
      delete config.headers['X-Skip-Auth'];
      return config;
    }

    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: Auto-refresh on 401 + Global Error Toast ─
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _silent?: boolean };

    // Handle 401 with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          null,
          {
            params: { refreshToken },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const newAccessToken = res.data['access-token'];
        // Update encrypted storage and memory cache
        await secureStorage.setItem('access-token', newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global error toast (skip for silent requests or 401 already handled)
    if (!originalRequest?._silent && error.response?.status !== 401) {
      const message = extractErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// ─── Generic API Request Helper ─────────────────────────────────────
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    withAuth?: boolean;
    params?: Record<string, string>;
    silent?: boolean;
  } = {},
): Promise<T> {
  const { method = 'GET', body, withAuth = true, params, silent = false } = options;

  const headers: Record<string, string> = {};
  if (!withAuth) {
    headers['X-Skip-Auth'] = 'true';
  }

  const config: Record<string, unknown> = {
    url: endpoint,
    method,
    data: body,
    params,
    headers: {
      ...headers,
      ...(silent ? { _silent: 'true' } : {}),
    },
    _silent: silent,
  };

  const response = await api.request<T>(config as any);

  return response.data;
}

export { BASE_URL, api };
