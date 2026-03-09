export interface SupportMessage {
  id?: string;
  fullName: string;
  email: string;
  objet: string;
  message: string;
  treated: boolean;
  createdAt?: string;
}
