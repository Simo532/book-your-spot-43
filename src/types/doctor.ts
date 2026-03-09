export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface TagResponseDto {
  id: string;
  name: string;
}

export interface BadgeResponseDTO {
  id: string;
  name: string;
  color: string;
}

export interface DoctorSpecialityResponseDTO {
  id: string;
  name: string;
  description: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface DoctorResponseDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  speciality: DoctorSpecialityResponseDTO;
  birthDate: string;
  age: number;
  gender: Gender;
  yearsOfExperience: number;
  consultationFee: number;
  bio?: string;
  profilePicture: string;
  visitCard: string;
  online: boolean;
  address: Address;
  tags: TagResponseDto[];
  badge: BadgeResponseDTO;
  averageRating?: number;
  reviewCount?: number;
}

export interface DoctorRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialityId: string;
  birthDate: string;
  gender: Gender;
  yearsOfExperience: number;
  consultationFee: number;
  bio?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface DoctorMonthlyStats {
  [key: string]: unknown;
}
