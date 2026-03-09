import { apiRequest } from './api';
import { DoctorSlotDTO } from '@/types/doctorSlot';

export const doctorSlotService = {
  // Get slots for a doctor by day of week
  getSlotsByDoctorAndDay(doctorId: string, dayOfWeek: string) {
    return apiRequest<DoctorSlotDTO[]>(`/slots/doctor/${doctorId}/day/${dayOfWeek}`);
  },

  // Get AVAILABLE slots for a doctor by day + date
  getAvailableSlotsByDoctorAndDay(doctorId: string, dayOfWeek: string, date: Date) {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return apiRequest<DoctorSlotDTO[]>(
      `/slots/doctor/${doctorId}/day/${dayOfWeek}/available`,
      { params: { date: formattedDate } },
    );
  },

  // Update a slot
  updateSlot(slotId: string, dto: DoctorSlotDTO) {
    return apiRequest<DoctorSlotDTO>(`/slots/${slotId}`, {
      method: 'PUT',
      body: dto,
    });
  },

  // Delete a slot
  deleteSlot(slotId: string) {
    return apiRequest<void>(`/slots/${slotId}`, { method: 'DELETE' });
  },
};
