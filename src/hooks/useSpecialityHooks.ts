import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorSpecialityService } from '@/services/doctorSpecialityService';
import { tagService } from '@/services/tagService';
import { DoctorSpecialityRequestDTO } from '@/types/doctorSpeciality';
import { TagRequestDto } from '@/types/tag';

// ─── Speciality Hooks ────────────────────────────────────────────────────────

export const useAllSpecialities = () =>
  useQuery({
    queryKey: ['specialities'],
    queryFn: () => doctorSpecialityService.getAll(),
  });

export const useSpecialityById = (id: string) =>
  useQuery({
    queryKey: ['speciality', id],
    queryFn: () => doctorSpecialityService.getById(id),
    enabled: !!id,
  });

export const useCreateSpeciality = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: DoctorSpecialityRequestDTO) => doctorSpecialityService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['specialities'] }),
  });
};

export const useUpdateSpeciality = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: DoctorSpecialityRequestDTO }) =>
      doctorSpecialityService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['specialities'] }),
  });
};

export const useDeleteSpeciality = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorSpecialityService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['specialities'] }),
  });
};

// ─── Tag Hooks ───────────────────────────────────────────────────────────────

export const useTagsBySpeciality = (specialityId: string) =>
  useQuery({
    queryKey: ['tags', 'speciality', specialityId],
    queryFn: () => tagService.getAllBySpeciality(specialityId),
    enabled: !!specialityId,
  });

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: TagRequestDto) => tagService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useUpdateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, dto }: { tagId: string; dto: TagRequestDto }) =>
      tagService.update(tagId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => tagService.delete(tagId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
};
