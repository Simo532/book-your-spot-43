import { apiRequest } from './api';
import { SupportMessage } from '@/types/support';
import { PageResponse } from '@/types/appointment';

export const supportMessageService = {
  create(message: SupportMessage) {
    return apiRequest<SupportMessage>('/support', { method: 'POST', body: message });
  },

  getAll(page = 0, size = 10) {
    return apiRequest<PageResponse<SupportMessage>>('/support', {
      params: { page: String(page), size: String(size) },
    });
  },

  getAllByTreated(treated: boolean, page = 0, size = 10) {
    return apiRequest<PageResponse<SupportMessage>>('/support/treated', {
      params: { treated: String(treated), page: String(page), size: String(size) },
    });
  },

  getById(id: string) {
    return apiRequest<SupportMessage>(`/support/${id}`);
  },

  update(id: string, message: SupportMessage) {
    return apiRequest<SupportMessage>(`/support/${id}`, { method: 'PUT', body: message });
  },

  delete(id: string) {
    return apiRequest<boolean>(`/support/${id}`, { method: 'DELETE' });
  },
};
