import { apiRequest, api } from './api';
import { PatientResponseDTO, PatientRequestDTO } from '@/types/patient';
import { Gender } from '@/types/doctor';
import { PageResponse } from '@/types/appointment';

// ─── Helper: multipart patient request ──────────────────────────────────────
async function multipartPatientRequest(
  url: string,
  method: 'POST' | 'PUT',
  dto: PatientRequestDTO,
  profilePicture?: File,
): Promise<PatientResponseDTO> {
  const formData = new FormData();

  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (profilePicture) formData.append('profilePicture', profilePicture);

  const { data } = await api.request<PatientResponseDTO>({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

// ─── PatientService ─────────────────────────────────────────────────────────
export const patientService = {
  create(dto: PatientRequestDTO, profilePicture?: File) {
    return multipartPatientRequest('/patients', 'POST', dto, profilePicture);
  },

  createByAdmin(dto: PatientRequestDTO, password: string, profilePicture?: File) {
    return multipartPatientRequest(
      `/patients/admin?password=${encodeURIComponent(password)}`,
      'POST', dto, profilePicture,
    );
  },

  update(id: string, dto: PatientRequestDTO, profilePicture?: File) {
    return multipartPatientRequest(`/patients/${id}`, 'PUT', dto, profilePicture);
  },

  getById(id: string) {
    return apiRequest<PatientResponseDTO>(`/patients/${id}`);
  },

  async getByEmail(email: string): Promise<PatientResponseDTO | Record<string, unknown>> {
    try {
      return await apiRequest<PatientResponseDTO>('/patients/by-email', { params: { email } });
    } catch {
      return {};
    }
  },

  getByUserId(userId: string) {
    return apiRequest<PatientResponseDTO>(`/patients/user/${userId}`);
  },

  delete(id: string) {
    return apiRequest<string>(`/patients/${id}`, { method: 'DELETE' });
  },

  searchPatientsForAdmin(params: {
    gender?: Gender;
    city?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    page?: number;
    size?: number;
  }) {
    const query: Record<string, string> = {};
    if (params.gender) query.gender = params.gender;
    if (params.city) query.city = params.city;
    if (params.email) query.email = params.email;
    if (params.phone) query.phone = params.phone;
    if (params.firstName) query.firstName = params.firstName;
    if (params.lastName) query.lastName = params.lastName;
    if (params.enabled !== undefined) query.enabled = String(params.enabled);
    if (params.createdAfter) query.createdAfter = params.createdAfter;
    if (params.createdBefore) query.createdBefore = params.createdBefore;
    query.page = String(params.page ?? 0);
    query.size = String(params.size ?? 10);

    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/admin/search/patients', { params: query });
  },

  getAll(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients', {
      params: { page: String(page), size: String(size) },
    });
  },

  getAllEnabled(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/account-enabled', {
      params: { page: String(page), size: String(size) },
    });
  },

  getAllDisabled(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/account-disabled', {
      params: { page: String(page), size: String(size) },
    });
  },

  getByPhone(phone: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-phone', {
      params: { phone, page: String(page), size: String(size) },
    });
  },

  getByGender(gender: Gender, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-gender', {
      params: { gender, page: String(page), size: String(size) },
    });
  },

  getByCity(city: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-city', {
      params: { city, page: String(page), size: String(size) },
    });
  },

  getByPostalCode(postalCode: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-postalCode', {
      params: { postalCode, page: String(page), size: String(size) },
    });
  },
};
