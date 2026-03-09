import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportMessageService } from '@/services/supportMessageService';
import { SupportMessage } from '@/types/support';

export const useAllSupportMessages = (page = 0, size = 10) =>
  useQuery({
    queryKey: ['support', 'all', page, size],
    queryFn: () => supportMessageService.getAll(page, size),
  });

export const useSupportByTreated = (treated: boolean, page = 0, size = 10) =>
  useQuery({
    queryKey: ['support', 'treated', treated, page, size],
    queryFn: () => supportMessageService.getAllByTreated(treated, page, size),
  });

export const useSupportById = (id: string) =>
  useQuery({
    queryKey: ['support', id],
    queryFn: () => supportMessageService.getById(id),
    enabled: !!id,
  });

export const useCreateSupportMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message: SupportMessage) => supportMessageService.create(message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support'] }),
  });
};

export const useUpdateSupportMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: SupportMessage }) =>
      supportMessageService.update(id, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support'] }),
  });
};

export const useDeleteSupportMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supportMessageService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support'] }),
  });
};
