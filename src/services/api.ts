import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8090/api/v1';

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

// ─── Axios Instance ──────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
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
    // Skip auth for public endpoints
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

// ─── Response Interceptor: Auto-refresh on 401 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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
  } = {},
): Promise<T> {
  const { method = 'GET', body, withAuth = true, params } = options;

  const headers: Record<string, string> = {};
  if (!withAuth) {
    headers['X-Skip-Auth'] = 'true';
  }

  const response = await api.request<T>({
    url: endpoint,
    method,
    data: body,
    params,
    headers,
  });

  return response.data;
}

export { BASE_URL, api };
