import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const BASE_URL = 'http://192.168.1.31:8090/api/v1';

// ─── Token Storage ───────────────────────────────────────────────────
export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem('access-token'),
  getRefreshToken: (): string | null => localStorage.getItem('refresh-token'),
  getUserRole: (): string | null => localStorage.getItem('user-role'),
  getUserId: (): string | null => localStorage.getItem('user-id'),
  getDoctorOrPatientId: (): string | null => localStorage.getItem('doctor-patient-id'),
  getUserEmail: (): string | null => localStorage.getItem('user-email'),
  getUserFirstName: (): string | null => localStorage.getItem('user-firstName'),
  getUserLastName: (): string | null => localStorage.getItem('user-lastName'),

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  },

  saveUserInfo(decoded: Record<string, unknown>) {
    if (decoded.role) localStorage.setItem('user-role', decoded.role as string);
    if (decoded.sub) localStorage.setItem('user-id', decoded.sub as string);
    if (decoded.email) localStorage.setItem('user-email', decoded.email as string);
    if (decoded.firstName) localStorage.setItem('user-firstName', decoded.firstName as string);
    if (decoded.lastName) localStorage.setItem('user-lastName', decoded.lastName as string);
  },

  setDoctorOrPatientId(id: string) {
    localStorage.setItem('doctor-patient-id', id);
  },

  isDoctor: () => localStorage.getItem('user-role') === 'DOCTOR',
  isPatient: () => localStorage.getItem('user-role') === 'PATIENT',
  isAdmin: () => localStorage.getItem('user-role') === 'ADMIN',

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
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-firstName');
    localStorage.removeItem('user-lastName');
    localStorage.removeItem('doctor-patient-id');
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
        localStorage.setItem('access-token', newAccessToken);
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

  const response = await api.request<T>({
    url: endpoint,
    method,
    data: body,
    params,
    headers: {
      ...headers,
      ...(silent ? { _silent: 'true' } : {}),
    },
    // @ts-ignore - custom property for interceptor
    _silent: silent,
  });

  return response.data;
}

export { BASE_URL, api };
