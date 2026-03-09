import { DoctorResponseDTO } from './doctor';

export interface FavoriteResponseDTO {
  id: string;
  userId: string;
  doctor: DoctorResponseDTO;
  createdAt: string;
}
