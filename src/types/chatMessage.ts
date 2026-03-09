export enum SenderType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export interface ChatMessageResponseDTO {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  contentType: string;
  sentAt: string;
  seen: boolean;
  senderType: SenderType;
}

export interface ChatMessageRequestDTO {
  chatId?: string;
  senderId?: string;
  senderType?: SenderType;
  content?: string;
  contentType?: string;
}
