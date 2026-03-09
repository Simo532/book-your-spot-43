import { apiRequest } from './api';
import { FavoriteResponseDTO } from '@/types/favorite';

export const favoriteService = {
  // Add doctor to favorites
  add(userId: string, doctorId: string) {
    return apiRequest<boolean>(`/favorites/${userId}/${doctorId}`, { method: 'POST' });
  },

  // Remove doctor from favorites
  remove(userId: string, doctorId: string) {
    return apiRequest<boolean>(`/favorites/${userId}/${doctorId}`, { method: 'DELETE' });
  },

  // Get all favorites for a user
  getAll(userId: string) {
    return apiRequest<FavoriteResponseDTO[]>(`/favorites/${userId}`);
  },

  // Check if doctor is in favorites
  isFavorite(userId: string, doctorId: string) {
    return apiRequest<boolean>(`/favorites/${userId}/check/${doctorId}`);
  },
};
