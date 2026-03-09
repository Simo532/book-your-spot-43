import { PaymentSubscriptionResponseDTO } from './payment';

export enum SubscriptionType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface SubscriptionResponseDTO {
  id: string;
  doctorId: string;
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  active: boolean;
  paid: boolean;
  doctorName: string;
  payment?: PaymentSubscriptionResponseDTO;
}
