import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { reviewService } from '@/services/reviewService';
import { chatService } from '@/services/chatService';
import { chatMessageService } from '@/services/chatMessageService';
import { notificationService } from '@/services/notificationService';
import { favoriteService } from '@/services/favoriteService';
import { supportMessageService } from '@/services/supportMessageService';
import { Gender } from '@/types/doctor';
import { AppointmentStatus } from '@/types/appointment';
import { ChatMessageRequestDTO } from '@/types/chatMessage';
import { SupportMessage } from '@/types/support';

// ─── Doctor Hooks ────────────────────────────────────────────────────────────

export const useDoctorById = (id: string) =>
  useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorService.getById(id),
    enabled: !!id,
  });

export const useDoctorByUserId = (userId: string) =>
  useQuery({
    queryKey: ['doctor', 'user', userId],
    queryFn: () => doctorService.getByUserId(userId),
    enabled: !!userId,
  });

export const useSearchDoctors = (params: Parameters<typeof doctorService.searchDoctors>[0]) =>
  useQuery({
    queryKey: ['doctors', 'search', params],
    queryFn: () => doctorService.searchDoctors(params),
  });

export const useSimilarDoctors = (doctorId: string) =>
  useQuery({
    queryKey: ['doctors', 'similar', doctorId],
    queryFn: () => doctorService.getSimilarDoctors(doctorId),
    enabled: !!doctorId,
  });

export const useDoctorMonthlyStats = (doctorId: string, month: number, year: number) =>
  useQuery({
    queryKey: ['doctor', 'stats', doctorId, month, year],
    queryFn: () => doctorService.getDoctorMonthlyStats(doctorId, month, year),
    enabled: !!doctorId,
  });

export const useDoctorCompletedCount = (doctorId: string) =>
  useQuery({
    queryKey: ['doctor', 'completedCount', doctorId],
    queryFn: () => appointmentService.getDoctorCompletedCount(doctorId),
    enabled: !!doctorId,
  });

// ─── Appointment Hooks ───────────────────────────────────────────────────────

export const useAppointmentsByDoctor = (doctorId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['appointments', 'doctor', doctorId, page, size],
    queryFn: () => appointmentService.getByDoctor(doctorId, page, size),
    enabled: !!doctorId,
  });

export const useAppointmentsByDoctorAndStatus = (doctorId: string, status: AppointmentStatus, page = 0, size = 10) =>
  useQuery({
    queryKey: ['appointments', 'doctor', doctorId, 'status', status, page, size],
    queryFn: () => appointmentService.getByDoctorAndStatus(doctorId, status, page, size),
    enabled: !!doctorId,
  });

export const useAppointmentsByDoctorAndDate = (doctorId: string, date: Date | null) =>
  useQuery({
    queryKey: ['appointments', 'doctor', doctorId, 'date', date?.toISOString()],
    queryFn: () => appointmentService.getByDoctorAndDate(doctorId, date!),
    enabled: !!doctorId && !!date,
  });

export const useAppointmentsByPatient = (patientId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['appointments', 'patient', patientId, page, size],
    queryFn: () => appointmentService.getByPatient(patientId, page, size),
    enabled: !!patientId,
  });

export const useAppointmentsByPatientAndStatus = (patientId: string, status: AppointmentStatus, page = 0, size = 10) =>
  useQuery({
    queryKey: ['appointments', 'patient', patientId, 'status', status, page, size],
    queryFn: () => appointmentService.getByPatientAndStatus(patientId, status, page, size),
    enabled: !!patientId,
  });

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.updateStatus(id, AppointmentStatus.CANCELLED),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
};

// ─── Review Hooks ────────────────────────────────────────────────────────────

export const useReviewsByDoctor = (doctorId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['reviews', 'doctor', doctorId, page, size],
    queryFn: () => reviewService.getByDoctor(doctorId, page, size),
    enabled: !!doctorId,
  });

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { patientId: string; doctorId: string; rating: number; comment: string }) =>
      reviewService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
};

export const useReviewExistsByPatientAndDoctor = (patientId: string, doctorId: string) =>
  useQuery({
    queryKey: ['reviews', 'exists', patientId, doctorId],
    queryFn: () => reviewService.existsByPatientAndDoctor(patientId, doctorId),
    enabled: !!patientId && !!doctorId,
  });

export const useDoctorReviewStats = (doctorIds: string[]) =>
  useQuery({
    queryKey: ['reviews', 'stats', doctorIds],
    queryFn: () => reviewService.getDoctorStats(doctorIds),
    enabled: doctorIds.length > 0,
  });

// ─── Chat Hooks ──────────────────────────────────────────────────────────────

export const useChatsByDoctor = (doctorId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['chats', 'doctor', doctorId, page, size],
    queryFn: () => chatService.getByDoctorId(doctorId, page, size),
    enabled: !!doctorId,
  });

export const useChatsByPatient = (patientId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['chats', 'patient', patientId, page, size],
    queryFn: () => chatService.getByPatientId(patientId, page, size),
    enabled: !!patientId,
  });

export const useChatMessages = (chatId: string, page = 0, size = 20) =>
  useQuery({
    queryKey: ['chatMessages', chatId, page, size],
    queryFn: () => chatMessageService.getMessagesByChatId(chatId, page, size),
    enabled: !!chatId,
  });

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ChatMessageRequestDTO) => chatMessageService.create(dto),
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ['chatMessages', variables.chatId] }),
  });
};

// ─── Notification Hooks ──────────────────────────────────────────────────────

export const useNotificationsByDoctor = (doctorId: string, page = 0, size = 20) =>
  useQuery({
    queryKey: ['notifications', 'doctor', doctorId, page, size],
    queryFn: () => notificationService.getByDoctor(doctorId, page, size),
    enabled: !!doctorId,
  });

export const useNotificationsByPatient = (patientId: string, page = 0, size = 20) =>
  useQuery({
    queryKey: ['notifications', 'patient', patientId, page, size],
    queryFn: () => notificationService.getByPatient(patientId, page, size),
    enabled: !!patientId,
  });

export const useMarkNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => notificationService.markAsRead(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

// ─── Favorite Hooks ──────────────────────────────────────────────────────────

export const useFavorites = (userId: string) =>
  useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => favoriteService.getAll(userId),
    enabled: !!userId,
  });

export const useIsFavorite = (userId: string, doctorId: string) =>
  useQuery({
    queryKey: ['favorites', userId, 'check', doctorId],
    queryFn: () => favoriteService.isFavorite(userId, doctorId),
    enabled: !!userId && !!doctorId,
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, doctorId, isFav }: { userId: string; doctorId: string; isFav: boolean }) =>
      isFav ? favoriteService.remove(userId, doctorId) : favoriteService.add(userId, doctorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
};

// ─── Support Hooks ───────────────────────────────────────────────────────────

export const useCreateSupportMessage = () =>
  useMutation({
    mutationFn: (message: SupportMessage) => supportMessageService.create(message),
  });
