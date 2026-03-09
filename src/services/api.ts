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

// ─── API Client ──────────────────────────────────────────────────────
function buildHeaders(withAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=UTF-8',
  };
  if (withAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function refreshTokenIfNeeded(): Promise<boolean> {
  if (!tokenStorage.isJwtExpired()) return true;

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh?refreshToken=${refreshToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const newAccessToken = data['access-token'];
      localStorage.setItem('access-token', newAccessToken);
      return true;
    } else {
      tokenStorage.clear();
      return false;
    }
  } catch {
    tokenStorage.clear();
    return false;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    withAuth?: boolean;
    params?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = 'GET', body, withAuth = true, params } = options;

  if (withAuth) {
    const valid = await refreshTokenIfNeeded();
    if (!valid) {
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const res = await fetch(url, {
    method,
    headers: buildHeaders(withAuth),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText}`);
  }

  const text = await res.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export { BASE_URL, buildHeaders };
