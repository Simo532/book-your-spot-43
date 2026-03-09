import axios from 'axios';
import { apiRequest, tokenStorage, BASE_URL } from './api';
import type { AuthTokens, UserRequestDTO, UserResponseDTO, UserLoginInfosDTO, NotificationsPreferenceDTO } from '@/types/auth';

// Public axios instance (no interceptors needed for auth endpoints)
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

export const authService = {
  // ─── Login ─────────────────────────────────────────────────────────
  async login(username: string, password: string): Promise<AuthTokens> {
    const { data } = await publicApi.post<AuthTokens>('/auth/login', null, {
      params: { username, password },
    });
    return data;
  },

  // ─── Signup ────────────────────────────────────────────────────────
  async signup(user: UserRequestDTO): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/signup', user);
    return data;
  },

  // ─── Google Sign-In ────────────────────────────────────────────────
  async loginWithGoogle(idToken: string): Promise<{ tokens?: AuthTokens; reason?: string; message?: string; status: number }> {
    try {
      const { data, status } = await publicApi.post('/auth/login-with-google', { idToken });
      return { ...data, status };
    } catch (error: any) {
      if (error.response) {
        return { ...error.response.data, status: error.response.status };
      }
      throw error;
    }
  },

  // ─── Complete Google Registration ──────────────────────────────────
  async completeGoogleRegistration(idToken: string, role: string): Promise<AuthTokens> {
    const { data } = await publicApi.post<AuthTokens>('/auth/complete-google-registration', { idToken, role });
    return data;
  },

  // ─── Forgot Password ──────────────────────────────────────────────
  async generateResetPasswordToken(email: string): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/generate-reset-password-token', null, {
      params: { email },
    });
    return data;
  },

  async verifyResetPasswordToken(email: string, token: string): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/verify-reset-password-token', null, {
      params: { email, token },
    });
    return data;
  },

  async updatePassword(email: string, newPassword: string): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/update-password', null, {
      params: { email, newPassword },
    });
    return data;
  },

  // ─── Email Verification ───────────────────────────────────────────
  async verifyEmail(email: string, code: string): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/verify-email', null, {
      params: { email, code },
    });
    return data;
  },

  async sendEmailForVerification(email: string): Promise<string> {
    const { data } = await publicApi.post<string>('/auth/send-email-for-email-verification', null, {
      params: { email },
    });
    return data;
  },

  // ─── User Info ─────────────────────────────────────────────────────
  async getUserByEmail(email: string): Promise<UserResponseDTO> {
    const { data } = await publicApi.get<UserResponseDTO>('/auth/get-user-by-email', {
      params: { email },
    });
    return data;
  },

  async getUserInfos(userId: string): Promise<UserLoginInfosDTO> {
    return apiRequest<UserLoginInfosDTO>(`/auth/${userId}/infos`);
  },

  async getProfileByUserId(userId: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/profiles/user/${userId}`);
  },

  // ─── Account Management (Admin) ───────────────────────────────────
  async enableAccount(accountId: string): Promise<string> {
    return apiRequest<string>(`/auth/enable-account/${accountId}`, { method: 'PUT' });
  },

  async disableAccount(accountId: string): Promise<string> {
    return apiRequest<string>(`/auth/disable-account/${accountId}`, { method: 'PUT' });
  },

  async getAllAdmins(): Promise<UserResponseDTO[]> {
    return apiRequest<UserResponseDTO[]>('/auth/admins');
  },

  async createAdminAccount(user: UserRequestDTO): Promise<string> {
    return apiRequest<string>('/auth/admin/create-admin', { method: 'POST', body: user });
  },

  async deleteAdminAccount(accountId: string): Promise<string> {
    return apiRequest<string>(`/auth/admin/${accountId}`, { method: 'DELETE' });
  },

  // ─── Online Status ────────────────────────────────────────────────
  async getOnlineUsers(): Promise<Array<Record<string, string>>> {
    return apiRequest<Array<Record<string, string>>>('/auth/online');
  },

  async makeUserOnline(userId: string): Promise<string> {
    return apiRequest<string>(`/auth/make-online/${userId}`, { method: 'PUT' });
  },

  async makeUserOffline(userId: string): Promise<string> {
    return apiRequest<string>(`/auth/make-offline/${userId}`, { method: 'PUT' });
  },

  // ─── Notifications Preferences ────────────────────────────────────
  async getNotificationPreferences(userId: string): Promise<NotificationsPreferenceDTO> {
    return apiRequest<NotificationsPreferenceDTO>(`/auth/${userId}/notifications-preferences`);
  },

  async updateNotificationPreferences(userId: string, pushEnabled: boolean, emailEnabled: boolean): Promise<string> {
    return apiRequest<string>(
      `/auth/${userId}/notifications-preferences`,
      { method: 'PUT', params: { pushEnabled: String(pushEnabled), emailEnabled: String(emailEnabled) } },
    );
  },

  // ─── Device Token ─────────────────────────────────────────────────
  async saveDeviceToken(userId: string, token: string): Promise<string> {
    return apiRequest<string>('/auth/save-device-token', {
      method: 'POST',
      params: { userId, token },
    });
  },

  // ─── Helper: Save login data ──────────────────────────────────────
  async saveLoginData(tokens: AuthTokens) {
    await tokenStorage.saveTokens(tokens['access-token'], tokens['refresh-token']);
    const decoded = tokenStorage.decodeToken(tokens['access-token']);
    await tokenStorage.saveUserInfo(decoded);
  },

  logout() {
    tokenStorage.clear();
    window.location.href = '/login';
  },
};
