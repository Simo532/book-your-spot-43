import { apiRequest } from './api';
import { DoctorSpecialityRequestDTO, DoctorSpecialityResponseDTO } from '@/types/doctorSpeciality';

export const doctorSpecialityService = {
  // Create speciality (admin)
  create(dto: DoctorSpecialityRequestDTO) {
    return apiRequest<DoctorSpecialityResponseDTO>(`/specialities`, {
      method: 'POST',
      body: dto,
    });
  },

  // Get speciality by ID
  getById(id: string) {
    return apiRequest<DoctorSpecialityResponseDTO>(`/specialities/${id}`);
  },

  // Get all specialities
  getAll() {
    return apiRequest<DoctorSpecialityResponseDTO[]>(`/specialities`);
  },

  // Update speciality (admin)
  update(id: string, dto: DoctorSpecialityRequestDTO) {
    return apiRequest<DoctorSpecialityResponseDTO>(`/specialities/${id}`, {
      method: 'PUT',
      body: dto,
    });
  },

  // Delete speciality (admin)
  delete(id: string) {
    return apiRequest<string>(`/specialities/${id}`, { method: 'DELETE' });
  },
};
