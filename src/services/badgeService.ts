import { apiRequest, api } from './api';
import { BadgeResponseDTO, BadgeRequestDTO } from '@/types/badge';
import { DoctorResponseDTO } from '@/types/doctor';
import { PageResponse } from '@/types/appointment';

// ─── Helper: multipart badge request ────────────────────────────────────────
async function multipartBadgeRequest(
  url: string,
  method: 'POST' | 'PUT',
  dto: BadgeRequestDTO,
  image?: File,
): Promise<BadgeResponseDTO> {
  const formData = new FormData();

  formData.append('title', dto.title);
  formData.append('description', dto.description);
  formData.append('visibility', String(dto.visibility));
  formData.append('commentNumber', String(dto.commentNumber));
  formData.append('rating', String(dto.rating));
  formData.append('color', dto.color);
  formData.append('appointmentNumber', String(dto.appointmentNumber));

  if (image) formData.append('image', image);

  const { data } = await api.request<BadgeResponseDTO>({
    url,
    method,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

// ─── BadgeService ───────────────────────────────────────────────────────────
export const badgeService = {
  create(dto: BadgeRequestDTO, image?: File) {
    return multipartBadgeRequest('/badges', 'POST', dto, image);
  },

  getAll() {
    return apiRequest<BadgeResponseDTO[]>('/badges');
  },

  getById(id: string) {
    return apiRequest<BadgeResponseDTO>(`/badges/${id}`);
  },

  update(id: string, dto: BadgeRequestDTO, image?: File) {
    return multipartBadgeRequest(`/badges/${id}`, 'PUT', dto, image);
  },

  delete(id: string) {
    return apiRequest<void>(`/badges/${id}`, { method: 'DELETE' });
  },

  getDoctorsByBadge(badgeId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<DoctorResponseDTO>>(`/badges/${badgeId}/doctors`, {
      params: { page: String(page), size: String(size) },
    });
  },
};
