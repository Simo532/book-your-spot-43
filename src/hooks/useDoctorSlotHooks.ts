import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorSlotService } from '@/services/doctorSlotService';
import { DoctorSlotDTO } from '@/types/doctorSlot';

export const useDoctorSlotsByDay = (doctorId: string, dayOfWeek: string) =>
  useQuery({
    queryKey: ['doctorSlots', doctorId, dayOfWeek],
    queryFn: () => doctorSlotService.getSlotsByDoctorAndDay(doctorId, dayOfWeek),
    enabled: !!doctorId && !!dayOfWeek,
  });

export const useAvailableSlots = (doctorId: string, dayOfWeek: string, date: Date | null) =>
  useQuery({
    queryKey: ['doctorSlots', doctorId, dayOfWeek, 'available', date?.toISOString()],
    queryFn: () => doctorSlotService.getAvailableSlotsByDoctorAndDay(doctorId, dayOfWeek, date!),
    enabled: !!doctorId && !!dayOfWeek && !!date,
  });

export const useUpdateSlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, dto }: { slotId: string; dto: DoctorSlotDTO }) =>
      doctorSlotService.updateSlot(slotId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctorSlots'] }),
  });
};

export const useDeleteSlot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => doctorSlotService.deleteSlot(slotId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctorSlots'] }),
  });
};
