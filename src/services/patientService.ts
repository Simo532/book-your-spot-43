import { apiRequest, tokenStorage, BASE_URL } from './api';
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

  const token = tokenStorage.getAccessToken();
  const res = await fetch(url, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Patient multipart error [${res.status}]: ${errorText}`);
  }

  return res.json();
}

// ─── PatientService ─────────────────────────────────────────────────────────
export const patientService = {
  // Create patient (multipart)
  create(dto: PatientRequestDTO, profilePicture?: File) {
    return multipartPatientRequest(`${BASE_URL}/patients`, 'POST', dto, profilePicture);
  },

  // Create patient by admin (multipart)
  createByAdmin(dto: PatientRequestDTO, password: string, profilePicture?: File) {
    return multipartPatientRequest(
      `${BASE_URL}/patients/admin?password=${encodeURIComponent(password)}`,
      'POST', dto, profilePicture,
    );
  },

  // Update patient (multipart)
  update(id: string, dto: PatientRequestDTO, profilePicture?: File) {
    return multipartPatientRequest(`${BASE_URL}/patients/${id}`, 'PUT', dto, profilePicture);
  },

  // Get patient by ID
  getById(id: string) {
    return apiRequest<PatientResponseDTO>(`/patients/${id}`);
  },

  // Get patient by email
  async getByEmail(email: string): Promise<PatientResponseDTO | Record<string, unknown>> {
    try {
      return await apiRequest<PatientResponseDTO>('/patients/by-email', { params: { email } });
    } catch {
      return {};
    }
  },

  // Get patient by userId
  getByUserId(userId: string) {
    return apiRequest<PatientResponseDTO>(`/patients/user/${userId}`);
  },

  // Delete patient
  delete(id: string) {
    return apiRequest<string>(`/patients/${id}`, { method: 'DELETE' });
  },

  // Admin search patients
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

  // Get all patients (paginated)
  getAll(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients', {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get all enabled patients
  getAllEnabled(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/account-enabled', {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get all disabled patients
  getAllDisabled(page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/account-disabled', {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get by phone
  getByPhone(phone: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-phone', {
      params: { phone, page: String(page), size: String(size) },
    });
  },

  // Get by gender
  getByGender(gender: Gender, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-gender', {
      params: { gender, page: String(page), size: String(size) },
    });
  },

  // Get by city
  getByCity(city: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-city', {
      params: { city, page: String(page), size: String(size) },
    });
  },

  // Get by postal code
  getByPostalCode(postalCode: string, page = 0, size = 10) {
    return apiRequest<PageResponse<PatientResponseDTO>>('/patients/by-postalCode', {
      params: { postalCode, page: String(page), size: String(size) },
    });
  },
};
