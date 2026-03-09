import { apiRequest } from './api';
import { SubscriptionResponseDTO } from '@/types/subscription';
import { PageResponse } from '@/types/appointment';

export const subscriptionService = {
  getByDoctor(doctorId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<SubscriptionResponseDTO>>(
      `/subscriptions/doctor/${doctorId}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  getSubscriptionsByActive(active: boolean, month: number, year: number, page = 0, size = 10) {
    return apiRequest<PageResponse<SubscriptionResponseDTO>>(
      '/subscriptions/by-active',
      { params: { active: String(active), month: String(month), year: String(year), page: String(page), size: String(size) } },
    );
  },

  getByType(type: string, page = 0, size = 10) {
    return apiRequest<PageResponse<SubscriptionResponseDTO>>(
      `/subscriptions/type/${type}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  getExpired(page = 0, size = 10) {
    return apiRequest<PageResponse<SubscriptionResponseDTO>>(
      '/subscriptions/expired',
      { params: { page: String(page), size: String(size) } },
    );
  },

  getByActive(active: boolean, page = 0, size = 10) {
    return apiRequest<PageResponse<SubscriptionResponseDTO>>(
      '/subscriptions/active',
      { params: { active: String(active), page: String(page), size: String(size) } },
    );
  },
};
