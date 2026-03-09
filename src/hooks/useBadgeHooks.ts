import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { badgeService } from '@/services/badgeService';
import { BadgeRequestDTO } from '@/types/badge';

export const useAllBadges = () =>
  useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeService.getAll(),
  });

export const useBadgeById = (id: string) =>
  useQuery({
    queryKey: ['badge', id],
    queryFn: () => badgeService.getById(id),
    enabled: !!id,
  });

export const useCreateBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, image }: { dto: BadgeRequestDTO; image?: File }) =>
      badgeService.create(dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useUpdateBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, image }: { id: string; dto: BadgeRequestDTO; image?: File }) =>
      badgeService.update(id, dto, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useDeleteBadge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => badgeService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['badges'] }),
  });
};

export const useDoctorsByBadge = (badgeId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['badge', badgeId, 'doctors', page, size],
    queryFn: () => badgeService.getDoctorsByBadge(badgeId, page, size),
    enabled: !!badgeId,
  });
