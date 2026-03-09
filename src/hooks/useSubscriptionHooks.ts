import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';

export const useSubscriptionsByDoctor = (doctorId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['subscriptions', 'doctor', doctorId, page, size],
    queryFn: () => subscriptionService.getByDoctor(doctorId, page, size),
    enabled: !!doctorId,
  });

export const useSubscriptionsByActive = (active: boolean, month: number, year: number, page = 0, size = 10) =>
  useQuery({
    queryKey: ['subscriptions', 'active', active, month, year, page, size],
    queryFn: () => subscriptionService.getSubscriptionsByActive(active, month, year, page, size),
  });

export const useSubscriptionsByType = (type: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['subscriptions', 'type', type, page, size],
    queryFn: () => subscriptionService.getByType(type, page, size),
    enabled: !!type,
  });

export const useExpiredSubscriptions = (page = 0, size = 10) =>
  useQuery({
    queryKey: ['subscriptions', 'expired', page, size],
    queryFn: () => subscriptionService.getExpired(page, size),
  });
