export interface ChatResponseDTO {
  id: string;
  patientId?: string;
  doctorId?: string;
  patientUserId?: string;
  doctorUserId?: string;
  patientImage?: string;
  doctorImage?: string;
  patientFullName?: string;
  doctorFullName?: string;
  createdAt: string;
  userId?: string;
}

export interface ChatRequestDTO {
  patientId: string;
  doctorId: string;
}

export interface ChatRequestDTO2 {
  userId: string;
  patientId?: string;
  doctorId?: string;
}
