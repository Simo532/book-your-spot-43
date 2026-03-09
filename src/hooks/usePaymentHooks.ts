import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { PaymentStatus, PaymentMethod, PaymentAppointmentRequestDTO } from '@/types/payment';

// ─── Wallet Hooks ────────────────────────────────────────────────────────────

export const useDoctorWallet = (doctorId: string) =>
  useQuery({
    queryKey: ['wallet', 'doctor', doctorId],
    queryFn: () => paymentService.getDoctorWallet(doctorId),
    enabled: !!doctorId,
  });

export const usePatientWallet = (patientId: string) =>
  useQuery({
    queryKey: ['wallet', 'patient', patientId],
    queryFn: () => paymentService.getPatientWallet(patientId),
    enabled: !!patientId,
  });

export const useDoctorWalletHistory = (doctorId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['wallet', 'doctor', doctorId, 'history', page, size],
    queryFn: () => paymentService.getDoctorWalletHistory(doctorId, page, size),
    enabled: !!doctorId,
  });

export const usePatientWalletHistory = (patientId: string, page = 0, size = 10) =>
  useQuery({
    queryKey: ['wallet', 'patient', patientId, 'history', page, size],
    queryFn: () => paymentService.getPatientWalletHistory(patientId, page, size),
    enabled: !!patientId,
  });

// ─── Payment Hooks ───────────────────────────────────────────────────────────

export const useAppointmentPaymentsByStatus = (status: PaymentStatus, page = 0, size = 10) =>
  useQuery({
    queryKey: ['payments', 'appointments', 'status', status, page, size],
    queryFn: () => paymentService.getAppointmentPaymentsByStatus(status, page, size),
    enabled: !!status,
  });

export const useCreateAppointmentPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PaymentAppointmentRequestDTO) => paymentService.createAppointmentPayment(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  });
};

// ─── Admin Wallet Operations ─────────────────────────────────────────────────

export const useAddToDoctorWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, amount, description }: { doctorId: string; amount: number; description: string }) =>
      paymentService.addAmountToDoctorWallet(doctorId, amount, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  });
};

export const useSubtractFromDoctorWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, amount, description }: { doctorId: string; amount: number; description: string }) =>
      paymentService.subtractAmountFromDoctorWallet(doctorId, amount, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  });
};

export const useAddToPatientWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, amount, description }: { patientId: string; amount: number; description: string }) =>
      paymentService.addAmountToPatientWallet(patientId, amount, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  });
};

export const useSubtractFromPatientWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, amount, description }: { patientId: string; amount: number; description: string }) =>
      paymentService.subtractAmountFromPatientWallet(patientId, amount, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  });
};
