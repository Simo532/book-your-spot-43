import { apiRequest } from './api';
import type { AppointmentRequestDTO, AppointmentResponseDTO, AppointmentStatus, PageResponse } from '@/types/appointment';

export const appointmentService = {
  // ─── CRUD ──────────────────────────────────────────────────────────
  async create(dto: AppointmentRequestDTO): Promise<AppointmentResponseDTO> {
    return apiRequest<AppointmentResponseDTO>('/appointments', {
      method: 'POST',
      body: dto,
    });
  },

  async update(appointmentId: string, dto: AppointmentRequestDTO): Promise<AppointmentResponseDTO> {
    return apiRequest<AppointmentResponseDTO>(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: dto,
    });
  },

  async getById(id: string): Promise<AppointmentResponseDTO> {
    return apiRequest<AppointmentResponseDTO>(`/appointments/${id}`);
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/appointments/${id}`, { method: 'DELETE' });
  },

  // ─── Status ────────────────────────────────────────────────────────
  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentResponseDTO> {
    return apiRequest<AppointmentResponseDTO>(`/appointments/${id}/status`, {
      method: 'PUT',
      params: { status },
    });
  },

  async canBeCancelled(appointmentId: string): Promise<boolean> {
    const result = await apiRequest<string>(`/appointments/${appointmentId}/can-be-cancelled`);
    return result === 'true';
  },

  // ─── Proposed Date ─────────────────────────────────────────────────
  async updateProposedDate(appointmentId: string, proposedDate: Date): Promise<void> {
    return apiRequest<void>(`/appointments/${appointmentId}/proposed-date`, {
      method: 'PUT',
      params: { doctorProposedDate: proposedDate.toISOString() },
    });
  },

  // ─── Doctor queries ────────────────────────────────────────────────
  async getByDoctor(doctorId: string, page = 0, size = 10): Promise<AppointmentResponseDTO[]> {
    const data = await apiRequest<{ content: AppointmentResponseDTO[] }>(
      `/appointments/doctor/${doctorId}`,
      { params: { page: String(page), size: String(size) } }
    );
    return data.content;
  },

  async getByDoctorAndDate(doctorId: string, date: Date): Promise<AppointmentResponseDTO[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return apiRequest<AppointmentResponseDTO[]>(
      `/appointments/doctor/${doctorId}/date`,
      { params: { date: formattedDate } }
    );
  },

  async getByDoctorAndMonth(doctorId: string, year: number, month: number): Promise<AppointmentResponseDTO[]> {
    return apiRequest<AppointmentResponseDTO[]>(
      `/appointments/doctor/${doctorId}/month`,
      { params: { year: String(year), month: String(month) } }
    );
  },

  async getByDoctorAndStatus(
    doctorId: string,
    status: AppointmentStatus,
    page = 0,
    size = 10
  ): Promise<PageResponse<AppointmentResponseDTO>> {
    return apiRequest<PageResponse<AppointmentResponseDTO>>(
      `/appointments/doctor/${doctorId}/status`,
      { params: { status, page: String(page), size: String(size) } }
    );
  },

  async getDoctorCompletedCount(doctorId: string): Promise<number> {
    const result = await apiRequest<string>(`/appointments/count-completed-by-doctor/${doctorId}`);
    return parseInt(result, 10);
  },

  // ─── Patient queries ───────────────────────────────────────────────
  async getByPatient(patientId: string, page = 0, size = 10): Promise<AppointmentResponseDTO[]> {
    const data = await apiRequest<{ content: AppointmentResponseDTO[] }>(
      `/appointments/patient/${patientId}`,
      { params: { page: String(page), size: String(size) } }
    );
    return data.content;
  },

  async getByPatientAndStatus(
    patientId: string,
    status: AppointmentStatus,
    page = 0,
    size = 10
  ): Promise<PageResponse<AppointmentResponseDTO>> {
    return apiRequest<PageResponse<AppointmentResponseDTO>>(
      `/appointments/patient/${patientId}/status`,
      { params: { status, page: String(page), size: String(size) } }
    );
  },

  // ─── Counts ────────────────────────────────────────────────────────
  async getActiveCountByPatientAndDoctor(patientId: string, doctorId: string): Promise<number> {
    const result = await apiRequest<string>('/appointments/active-count', {
      params: { patientId, doctorId },
    });
    return parseInt(result, 10);
  },

  async getLimitedCountByPatient(patientId: string): Promise<number> {
    const result = await apiRequest<string>('/appointments/limited-count', {
      params: { patientId },
    });
    return parseInt(result, 10);
  },
};
