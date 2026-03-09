export enum NotificationType {
  APPOINTMENT = 'APPOINTMENT',
  CHAT = 'CHAT',
  REVIEW = 'REVIEW',
  SYSTEM = 'SYSTEM',
  BADGE = 'BADGE',
  XP = 'XP',
}

export interface NotificationResponseDTO {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  patientId?: string;
  doctorId?: string;
  userId?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationRequestDTO {
  title: string;
  message: string;
  type: NotificationType;
  patientId?: string;
  doctorId?: string;
}
