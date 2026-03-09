import { apiRequest, tokenStorage, BASE_URL } from './api';
import type { AuthTokens, UserRequestDTO, UserResponseDTO, UserLoginInfosDTO, NotificationsPreferenceDTO } from '@/types/auth';

export const authService = {
  // ─── Login ─────────────────────────────────────────────────────────
  async login(username: string, password: string): Promise<AuthTokens> {
    const res = await fetch(
      `${BASE_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }
    );

    if (!res.ok) throw new Error('Email ou mot de passe incorrect');
    return res.json();
  },

  // ─── Signup ────────────────────────────────────────────────────────
  async signup(user: UserRequestDTO): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error('Cet email est déjà utilisé');
    return res.text();
  },

  // ─── Google Sign-In (send Firebase ID token) ──────────────────────
  async loginWithGoogle(idToken: string): Promise<{ tokens?: AuthTokens; reason?: string; message?: string; status: number }> {
    const res = await fetch(`${BASE_URL}/auth/login-with-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    return { ...data, status: res.status };
  },

  // ─── Complete Google Registration (new user picks role) ───────────
  async completeGoogleRegistration(idToken: string, role: string): Promise<AuthTokens> {
    const res = await fetch(`${BASE_URL}/auth/complete-google-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ idToken, role }),
    });

    if (!res.ok) throw new Error('Failed to complete Google registration');
    return res.json();
  },

  // ─── Forgot Password ──────────────────────────────────────────────
  async generateResetPasswordToken(email: string): Promise<string> {
    const res = await fetch(
      `${BASE_URL}/auth/generate-reset-password-token?email=${encodeURIComponent(email)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Failed to generate reset token');
    return res.text();
  },

  async verifyResetPasswordToken(email: string, token: string): Promise<string> {
    const res = await fetch(
      `${BASE_URL}/auth/verify-reset-password-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Invalid reset token');
    return res.text();
  },

  async updatePassword(email: string, newPassword: string): Promise<string> {
    const res = await fetch(
      `${BASE_URL}/auth/update-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Failed to update password');
    return res.text();
  },

  // ─── Email Verification ───────────────────────────────────────────
  async verifyEmail(email: string, code: string): Promise<string> {
    const res = await fetch(
      `${BASE_URL}/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Failed to verify email');
    return res.text();
  },

  async sendEmailForVerification(email: string): Promise<string> {
    const res = await fetch(
      `${BASE_URL}/auth/send-email-for-email-verification?email=${encodeURIComponent(email)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Failed to send verification email');
    return res.text();
  },

  // ─── User Info ─────────────────────────────────────────────────────
  async getUserByEmail(email: string): Promise<UserResponseDTO> {
    const res = await fetch(
      `${BASE_URL}/auth/get-user-by-email?email=${encodeURIComponent(email)}`,
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );
    if (!res.ok) throw new Error('Failed to get user');
    return res.json();
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
      { method: 'PUT', params: { pushEnabled: String(pushEnabled), emailEnabled: String(emailEnabled) } }
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
  saveLoginData(tokens: AuthTokens) {
    tokenStorage.saveTokens(tokens['access-token'], tokens['refresh-token']);
    const decoded = tokenStorage.decodeToken(tokens['access-token']);
    tokenStorage.saveUserInfo(decoded);
  },

  logout() {
    tokenStorage.clear();
    window.location.href = '/login';
  },
};
