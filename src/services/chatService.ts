import { apiRequest } from './api';
import { ChatResponseDTO, ChatRequestDTO, ChatRequestDTO2 } from '@/types/chat';
import { PageResponse } from '@/types/appointment';

export const chatService = {
  // Create a chat
  create(dto: ChatRequestDTO) {
    return apiRequest<ChatResponseDTO>(`/chats`, { method: 'POST', body: dto });
  },

  // Create a chat for admin (v2)
  createForAdmin(dto: ChatRequestDTO2) {
    return apiRequest<ChatResponseDTO>(`/chats/v2`, { method: 'POST', body: dto });
  },

  // Get chat by ID
  getById(id: string) {
    return apiRequest<ChatResponseDTO>(`/chats/${id}`);
  },

  // Check if chat exists between doctor and patient
  existsByDoctorAndPatient(doctorId: string, patientId: string) {
    return apiRequest<boolean>(`/chats/exists-by/${doctorId}/${patientId}`);
  },

  // Check if chat exists between admin and patient
  existsByAdminAndPatient(adminId: string, patientId: string) {
    return apiRequest<boolean>(`/chats/exists-by-patient/${patientId}/admin/${adminId}`);
  },

  // Check if chat exists between admin and doctor
  existsByAdminAndDoctor(adminId: string, doctorId: string) {
    return apiRequest<boolean>(`/chats/exists-by-doctor/${doctorId}/admin/${adminId}`);
  },

  // Delete chat
  delete(id: string) {
    return apiRequest<string>(`/chats/${id}`, { method: 'DELETE' });
  },

  // Get chats by patient (paginated)
  getByPatientId(patientId: string, page = 0, size = 5) {
    return apiRequest<PageResponse<ChatResponseDTO>>(`/chats/patient/${patientId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get chats by doctor (paginated)
  getByDoctorId(doctorId: string, page = 0, size = 5) {
    return apiRequest<PageResponse<ChatResponseDTO>>(`/chats/doctor/${doctorId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get chats for admin (paginated)
  getForAdmin(userId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<ChatResponseDTO>>(`/chats/admin/${userId}`, {
      params: { page: String(page), size: String(size) },
    });
  },
};
