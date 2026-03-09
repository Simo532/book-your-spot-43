import { apiRequest, api } from './api';
import { DoctorResponseDTO, DoctorRequestDTO, Gender } from '@/types/doctor';
import { PageResponse } from '@/types/appointment';

// ─── Helper: multipart upload (create / update) ─────────────────────────────
async function multipartDoctorRequest(
  url: string,
  method: 'POST' | 'PUT',
  dto: DoctorRequestDTO,
  profilePicture?: File,
  visitCard?: File,
): Promise<DoctorResponseDTO> {
  const formData = new FormData();

  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (profilePicture) formData.append('profilePicture', profilePicture);
  if (visitCard) formData.append('visitCard', visitCard);

  const { data } = await api.request<DoctorResponseDTO>({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

// ─── DoctorService ──────────────────────────────────────────────────────────

export const doctorService = {
  create(dto: DoctorRequestDTO, profilePicture?: File, visitCard?: File) {
    return multipartDoctorRequest('/doctors', 'POST', dto, profilePicture, visitCard);
  },

  createByAdmin(dto: DoctorRequestDTO, password: string, profilePicture?: File, visitCard?: File) {
    return multipartDoctorRequest(
      `/doctors/admin?password=${encodeURIComponent(password)}`,
      'POST', dto, profilePicture, visitCard,
    );
  },

  update(doctorId: string, dto: DoctorRequestDTO, profilePicture?: File, visitCard?: File) {
    return multipartDoctorRequest(`/doctors/${doctorId}`, 'PUT', dto, profilePicture, visitCard);
  },

  getById(id: string) {
    return apiRequest<DoctorResponseDTO>(`/doctors/${id}`);
  },

  async getByEmail(email: string): Promise<DoctorResponseDTO | Record<string, unknown>> {
    try {
      return await apiRequest<DoctorResponseDTO>(`/doctors/by-email`, { params: { email } });
    } catch {
      return {};
    }
  },

  getByUserId(userId: string) {
    return apiRequest<DoctorResponseDTO>(`/doctors/user/${userId}`);
  },

  delete(id: string) {
    return apiRequest<string>(`/doctors/${id}`, { method: 'DELETE' });
  },

  getDoctorMonthlyStats(doctorId: string, month: number, year: number) {
    return apiRequest<Record<string, unknown>>(`/doctors/${doctorId}/monthly-statistics`, {
      params: { month: String(month), year: String(year) },
    });
  },

  getOnlineAppointmentsInfosAndAudioCalls(doctorId: string) {
    return apiRequest<Record<string, unknown>>(
      `/doctors/${doctorId}/audio-calls-and-online-appointments-infos`,
    );
  },

  updateOnlineAppointmentsInfosAndAudioCalls(
    doctorId: string,
    onlineAppointmentsEnabled: boolean,
    audioCallsEnabled: boolean,
  ) {
    return apiRequest<string>(
      `/doctors/${doctorId}/audio-calls-online-appointments`,
      {
        method: 'PUT',
        params: {
          onlineAppointmentsEnabled: String(onlineAppointmentsEnabled),
          audioCallsEnabled: String(audioCallsEnabled),
        },
      },
    );
  },

  searchDoctors(params: {
    specialityId?: string;
    gender?: Gender;
    city?: string;
    minExp?: number;
    maxExp?: number;
    minFee?: number;
    maxFee?: number;
    userLat?: number;
    userLon?: number;
    radiusKm?: number;
    sortBy?: string;
    page?: number;
    size?: number;
  }) {
    const query: Record<string, string> = {};
    if (params.specialityId) query.specialityId = params.specialityId;
    if (params.gender) query.gender = params.gender;
    if (params.city) query.city = params.city;
    if (params.minExp !== undefined) query.minExp = String(params.minExp);
    if (params.maxExp !== undefined) query.maxExp = String(params.maxExp);
    if (params.minFee !== undefined) query.minFee = String(params.minFee);
    if (params.maxFee !== undefined) query.maxFee = String(params.maxFee);
    if (params.userLat !== undefined) query.userLat = String(params.userLat);
    if (params.userLon !== undefined) query.userLon = String(params.userLon);
    if (params.radiusKm !== undefined) query.radiusKm = String(params.radiusKm);
    query.sortBy = params.sortBy ?? 'topRated,nearby';
    query.page = String(params.page ?? 0);
    query.size = String(params.size ?? 10);

    return apiRequest<PageResponse<DoctorResponseDTO>>(`/doctors/search`, { params: query });
  },

  searchDoctorsForAdmin(params: {
    specialityId?: string;
    gender?: Gender;
    city?: string;
    minExp?: number;
    maxExp?: number;
    minFee?: number;
    maxFee?: number;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
    sortBy?: string;
    page?: number;
    size?: number;
  }) {
    const query: Record<string, string> = {};
    if (params.specialityId) query.specialityId = params.specialityId;
    if (params.gender) query.gender = params.gender;
    if (params.city) query.city = params.city;
    if (params.minExp !== undefined) query.minExp = String(params.minExp);
    if (params.maxExp !== undefined) query.maxExp = String(params.maxExp);
    if (params.minFee !== undefined) query.minFee = String(params.minFee);
    if (params.maxFee !== undefined) query.maxFee = String(params.maxFee);
    if (params.email) query.email = params.email;
    if (params.phone) query.phone = params.phone;
    if (params.firstName) query.firstName = params.firstName;
    if (params.lastName) query.lastName = params.lastName;
    if (params.enabled !== undefined) query.enabled = String(params.enabled);
    query.sortBy = params.sortBy ?? 'newest';
    query.page = String(params.page ?? 0);
    query.size = String(params.size ?? 10);

    return apiRequest<PageResponse<DoctorResponseDTO>>(`/doctors/admin/search/doctors`, { params: query });
  },

  getSimilarDoctors(doctorId: string) {
    return apiRequest<DoctorResponseDTO[]>(`/doctors/${doctorId}/similar`);
  },

  getAll(page = 0, size = 10) {
    return apiRequest<PageResponse<DoctorResponseDTO>>(`/doctors`, {
      params: { page: String(page), size: String(size) },
    });
  },

  getAllEnabled(page = 0, size = 10) {
    return apiRequest<PageResponse<DoctorResponseDTO>>(`/doctors/account-enabled`, {
      params: { page: String(page), size: String(size) },
    });
  },

  getAllDisabled(page = 0, size = 10) {
    return apiRequest<PageResponse<DoctorResponseDTO>>(`/doctors/account-disabled`, {
      params: { page: String(page), size: String(size) },
    });
  },
};
