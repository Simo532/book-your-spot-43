export interface BadgeResponseDTO {
  id: string;
  title: string;
  description: string;
  visibility: number;
  image?: string;
  color: string;
  commentNumber: number;
  rating: number;
  appointmentNumber: number;
}

export interface BadgeRequestDTO {
  title: string;
  description: string;
  visibility: number;
  commentNumber: number;
  rating: number;
  color: string;
  appointmentNumber: number;
}
