export interface ResponseDTO {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  content: string;
  createdAt: string;
}

export interface ReviewResponseDTO {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  rating: number;
  reactionsCount: number;
  comment: string;
  patientImage: string;
  createdAt: string;
  response?: ResponseDTO;
}

export interface ReviewRequestDTO {
  patientId: string;
  doctorId: string;
  rating: number;
  comment: string;
}

export interface ReviewReactionDTO {
  id: string;
  userId: string;
  reviewId: string;
}

export interface DoctorReviewStatsDTO {
  doctorId: string;
  averageRating: number;
  reviewCount: number;
}
