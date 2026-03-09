import { apiRequest, tokenStorage, BASE_URL } from './api';
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

  const token = tokenStorage.getAccessToken();
  const res = await fetch(url, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Badge multipart error [${res.status}]: ${errorText}`);
  }

  return res.json();
}

// ─── BadgeService ───────────────────────────────────────────────────────────
export const badgeService = {
  // Create badge (multipart)
  create(dto: BadgeRequestDTO, image?: File) {
    return multipartBadgeRequest(`${BASE_URL}/badges`, 'POST', dto, image);
  },

  // Get all badges
  getAll() {
    return apiRequest<BadgeResponseDTO[]>('/badges');
  },

  // Get badge by ID
  getById(id: string) {
    return apiRequest<BadgeResponseDTO>(`/badges/${id}`);
  },

  // Update badge (multipart)
  update(id: string, dto: BadgeRequestDTO, image?: File) {
    return multipartBadgeRequest(`${BASE_URL}/badges/${id}`, 'PUT', dto, image);
  },

  // Delete badge
  delete(id: string) {
    return apiRequest<void>(`/badges/${id}`, { method: 'DELETE' });
  },

  // Get doctors by badge (paginated)
  getDoctorsByBadge(badgeId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<DoctorResponseDTO>>(`/badges/${badgeId}/doctors`, {
      params: { page: String(page), size: String(size) },
    });
  },
};
