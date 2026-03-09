import { apiRequest } from './api';
import { TagResponseDto, TagRequestDto } from '@/types/tag';

export const tagService = {
  create(dto: TagRequestDto) {
    return apiRequest<TagResponseDto>('/tags', { method: 'POST', body: dto });
  },

  update(tagId: string, dto: TagRequestDto) {
    return apiRequest<TagResponseDto>(`/tags/${tagId}`, { method: 'PUT', body: dto });
  },

  delete(tagId: string) {
    return apiRequest<void>(`/tags/${tagId}`, { method: 'DELETE' });
  },

  getAllBySpeciality(specialityId: string) {
    return apiRequest<TagResponseDto[]>(`/tags/by-speciality/${specialityId}`);
  },
};
