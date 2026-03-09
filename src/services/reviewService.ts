import { apiRequest } from './api';
import {
  ReviewResponseDTO,
  ReviewRequestDTO,
  ReviewReactionDTO,
  DoctorReviewStatsDTO,
} from '@/types/review';
import { PageResponse } from '@/types/appointment';

export const reviewService = {
  // ── CRUD ──────────────────────────────────────────────────────────
  create(dto: ReviewRequestDTO) {
    return apiRequest<ReviewResponseDTO>('/reviews', { method: 'POST', body: dto });
  },

  getById(id: string) {
    return apiRequest<ReviewResponseDTO>(`/reviews/${id}`);
  },

  update(id: string, dto: ReviewRequestDTO) {
    return apiRequest<ReviewResponseDTO>(`/reviews/${id}`, { method: 'PUT', body: dto });
  },

  delete(id: string) {
    return apiRequest<string>(`/reviews/${id}`, { method: 'DELETE' });
  },

  // ── Stats ─────────────────────────────────────────────────────────
  getDoctorStats(doctorIds: string[]) {
    return apiRequest<DoctorReviewStatsDTO[]>('/reviews/doctor-stats', {
      method: 'POST',
      body: doctorIds,
    });
  },

  // ── By patient / doctor ───────────────────────────────────────────
  getByPatient(patientId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<ReviewResponseDTO>>(`/reviews/patient/${patientId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  getByDoctor(doctorId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<ReviewResponseDTO>>(`/reviews/doctor/${doctorId}`, {
      params: { page: String(page), size: String(size) },
    });
  },

  existsByPatientAndDoctor(patientId: string, doctorId: string) {
    return apiRequest<boolean>('/reviews/exists-by-patient-and-doctor', {
      params: { patientId, doctorId },
    });
  },

  // ── Reactions ─────────────────────────────────────────────────────
  reactionExists(userId: string, reviewId: string) {
    return apiRequest<boolean>('/reviews/reactions/exists', {
      params: { userId, reviewId },
    });
  },

  addReaction(userId: string, reviewId: string) {
    return apiRequest<ReviewReactionDTO>('/reviews/reactions', {
      method: 'POST',
      params: { userId, reviewId },
    });
  },

  deleteReaction(userId: string, reviewId: string) {
    return apiRequest<boolean>('/reviews/reactions', {
      method: 'DELETE',
      params: { userId, reviewId },
    });
  },

  getReactionsByReview(reviewId: string) {
    return apiRequest<ReviewReactionDTO[]>(`/reviews/${reviewId}/reactions`);
  },
};
