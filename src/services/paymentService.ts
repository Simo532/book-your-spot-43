import { apiRequest } from './api';
import {
  PaymentAppointmentResponseDTO,
  PaymentAppointmentRequestDTO,
  PaymentSubscriptionResponseDTO,
  PaymentSubscriptionRequestDTO,
  PaymentStatus,
  PaymentMethod,
  WalletResponseDTO,
  WalletOperationHistoryResponse,
} from '@/types/payment';
import { AppointmentStatus, PageResponse } from '@/types/appointment';

export const paymentService = {
  // ── Appointment Payments ──────────────────────────────────────────
  createAppointmentPayment(dto: PaymentAppointmentRequestDTO) {
    return apiRequest<PaymentAppointmentResponseDTO>('/payments/appointments', {
      method: 'POST',
      body: dto,
    });
  },

  getAppointmentPaymentById(id: string) {
    return apiRequest<PaymentAppointmentResponseDTO>(`/payments/appointments/${id}`);
  },

  deleteAppointmentPayment(id: string) {
    return apiRequest<string>(`/payments/appointments/${id}`, { method: 'DELETE' });
  },

  getPaymentByAppointment(appointmentId: string) {
    return apiRequest<PaymentAppointmentResponseDTO>(
      `/payments/appointments/by-appointment/${appointmentId}`,
    );
  },

  getAppointmentPaymentsByStatus(status: PaymentStatus, page = 0, size = 10) {
    return apiRequest<PageResponse<PaymentAppointmentResponseDTO>>(
      `/payments/appointments/status/${status}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  getAppointmentPaymentsByMethod(method: PaymentMethod, page = 0, size = 10) {
    return apiRequest<PageResponse<PaymentAppointmentResponseDTO>>(
      `/payments/appointments/method/${method}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  // ── Subscription Payments ─────────────────────────────────────────
  createSubscriptionPayment(dto: PaymentSubscriptionRequestDTO) {
    return apiRequest<PaymentSubscriptionResponseDTO>('/payments/subscriptions', {
      method: 'POST',
      body: dto,
    });
  },

  getSubscriptionPaymentById(id: string) {
    return apiRequest<PaymentSubscriptionResponseDTO>(`/payments/subscriptions/${id}`);
  },

  deleteSubscriptionPayment(id: string) {
    return apiRequest<string>(`/payments/subscriptions/${id}`, { method: 'DELETE' });
  },

  getPaymentBySubscription(subscriptionId: string) {
    return apiRequest<PaymentSubscriptionResponseDTO>(
      `/payments/subscriptions/by-subscription/${subscriptionId}`,
    );
  },

  getSubscriptionPaymentsByStatus(status: PaymentStatus, page = 0, size = 10) {
    return apiRequest<PageResponse<PaymentSubscriptionResponseDTO>>(
      `/payments/subscriptions/status/${status}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  getSubscriptionPaymentsByMethod(method: PaymentMethod, page = 0, size = 10) {
    return apiRequest<PageResponse<PaymentSubscriptionResponseDTO>>(
      `/payments/subscriptions/method/${method}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  // ── Wallets ───────────────────────────────────────────────────────
  getDoctorWallet(doctorId: string) {
    return apiRequest<WalletResponseDTO>(`/payments/wallets/doctor/${doctorId}`);
  },

  getPatientWallet(patientId: string) {
    return apiRequest<WalletResponseDTO>(`/payments/wallets/patient/${patientId}`);
  },

  getDoctorWalletHistory(doctorId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<WalletOperationHistoryResponse>>(
      `/payments/wallets/doctor/${doctorId}/history`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  getPatientWalletHistory(patientId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<WalletOperationHistoryResponse>>(
      `/payments/wallets/patient/${patientId}/history`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  // ── Refunds ───────────────────────────────────────────────────────
  refundAppointmentPayment(appointmentId: string, status: AppointmentStatus) {
    return apiRequest<string>(
      `/payments/appointments/${appointmentId}/refund`,
      { method: 'POST', params: { status } },
    );
  },

  // ── Admin Wallet Operations ───────────────────────────────────────
  addAmountToDoctorWallet(doctorId: string, amount: number, description: string) {
    return apiRequest<string>(
      `/payments/wallets/doctor/${doctorId}/add`,
      { method: 'POST', params: { amount: String(amount), description } },
    );
  },

  subtractAmountFromDoctorWallet(doctorId: string, amount: number, description: string) {
    return apiRequest<string>(
      `/payments/wallets/doctor/${doctorId}/subtract`,
      { method: 'POST', params: { amount: String(amount), description } },
    );
  },

  addAmountToPatientWallet(patientId: string, amount: number, description: string) {
    return apiRequest<string>(
      `/payments/wallets/patient/${patientId}/add`,
      { method: 'POST', params: { amount: String(amount), description } },
    );
  },

  subtractAmountFromPatientWallet(patientId: string, amount: number, description: string) {
    return apiRequest<string>(
      `/payments/wallets/patient/${patientId}/subtract`,
      { method: 'POST', params: { amount: String(amount), description } },
    );
  },
};
