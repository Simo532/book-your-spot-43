import { apiRequest } from './api';
import { NotificationResponseDTO, NotificationRequestDTO, NotificationType } from '@/types/notification';
import { PageResponse } from '@/types/appointment';

export const notificationService = {
  // Create notification
  create(dto: NotificationRequestDTO) {
    return apiRequest<NotificationResponseDTO>('/notifications', {
      method: 'POST',
      body: dto,
    });
  },

  // Mark notifications as read
  markAsRead(notificationIds: string[]) {
    return apiRequest<string>('/notifications/mark-as-read', {
      method: 'PUT',
      body: notificationIds,
    });
  },

  // Get notification by ID
  getById(id: string) {
    return apiRequest<NotificationResponseDTO>(`/notifications/${id}`);
  },

  // Delete notification
  delete(id: string) {
    return apiRequest<string>(`/notifications/${id}`, { method: 'DELETE' });
  },

  // Get by doctor (paginated)
  getByDoctor(doctorId: string, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/doctor/${doctorId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get by patient (paginated)
  getByPatient(patientId: string, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/patient/${patientId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get by user (paginated)
  getByUser(userId: string, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/user/${userId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  // Get by user and read status
  getByUserAndRead(userId: string, isRead: boolean, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/user/${userId}/read`, {
      params: { isRead: String(isRead), page: String(page), size: String(size) },
    });
  },

  // Get by user and type
  getByUserAndType(userId: string, type: NotificationType, page = 0, size = 10) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/user/${userId}/type`, {
      params: { type, page: String(page), size: String(size) },
    });
  },

  // Get by doctor and read status
  getByDoctorAndRead(doctorId: string, isRead: boolean, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/doctor/${doctorId}/read`, {
      params: { isRead: String(isRead), page: String(page), size: String(size) },
    });
  },

  // Get by patient and read status
  getByPatientAndRead(patientId: string, isRead: boolean, page = 0, size = 20) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/patient/${patientId}/read`, {
      params: { isRead: String(isRead), page: String(page), size: String(size) },
    });
  },

  // Get by doctor and type
  getByDoctorAndType(doctorId: string, type: NotificationType, page = 0, size = 10) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/doctor/${doctorId}/type`, {
      params: { type, page: String(page), size: String(size) },
    });
  },

  // Get by patient and type
  getByPatientAndType(patientId: string, type: NotificationType, page = 0, size = 10) {
    return apiRequest<PageResponse<NotificationResponseDTO>>(`/notifications/patient/${patientId}/type`, {
      params: { type, page: String(page), size: String(size) },
    });
  },
};
