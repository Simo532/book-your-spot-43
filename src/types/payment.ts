export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
}

export enum WalletOperationType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface PaymentAppointmentResponseDTO {
  id: string;
  amountPaid: number;
  paymentDate: string;
  status: PaymentStatus;
  method: PaymentMethod;
  appointmentId: string;
  wasCancelled: boolean;
}

export interface PaymentAppointmentRequestDTO {
  amountPaid: number;
  method: PaymentMethod;
  appointmentId: string;
}

export interface PaymentSubscriptionResponseDTO {
  id: string;
  amountPaid: number;
  paymentDate?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface PaymentSubscriptionRequestDTO {
  amountPaid: number;
  method: PaymentMethod;
  subscriptionId: string;
}

export interface WalletResponseDTO {
  id: string;
  balance: number;
  updatedAt: string;
}

export interface WalletOperationHistoryResponse {
  id: string;
  amount: number;
  operationDate: string;
  type: WalletOperationType;
  description?: string;
  currentWalletBalance?: number;
}
