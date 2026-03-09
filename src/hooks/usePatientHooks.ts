import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '@/services/patientService';
import { PatientRequestDTO } from '@/types/patient';
import { Gender } from '@/types/doctor';

export const usePatientById = (id: string) =>
  useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });

export const usePatientByUserId = (userId: string) =>
  useQuery({
    queryKey: ['patient', 'user', userId],
    queryFn: () => patientService.getByUserId(userId),
    enabled: !!userId,
  });

export const useUpdatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto, profilePicture }: { id: string; dto: PatientRequestDTO; profilePicture?: File }) =>
      patientService.update(id, dto, profilePicture),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['patient'] });
    },
  });
};

export const useSearchPatientsAdmin = (params: Parameters<typeof patientService.searchPatientsForAdmin>[0]) =>
  useQuery({
    queryKey: ['patients', 'admin', 'search', params],
    queryFn: () => patientService.searchPatientsForAdmin(params),
  });

export const useAllPatients = (page = 0, size = 10) =>
  useQuery({
    queryKey: ['patients', 'all', page, size],
    queryFn: () => patientService.getAll(page, size),
  });

export const useDeletePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });
};
