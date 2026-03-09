export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface AppointmentRequestDTO {
  doctorId: string;
  patientId: string;
  appointmentDate: string | null;
  online: boolean;
  asSoonAsPossible: boolean;
  patientMessage: string;
}

export interface AppointmentResponseDTO {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  patientTel: string;
  doctorTel: string;
  doctorImage: string;
  doctorUserId: string;
  patientUserId: string;
  patientAge: number;
  appointmentDate: string | null;
  createdAt: string;
  updatedAt: string;
  status: AppointmentStatus;
  patientMessage: string | null;
  doctorCity: string | null;
  online: boolean;
  asSoonAsPossible: boolean;
  doctorProposedDateTime: string | null;
  consultationFee: number;
}

export interface PageResponse<T> {
  content: T[];
  last: boolean;
  number: number;
  totalPages: number;
  totalElements: number;
}
