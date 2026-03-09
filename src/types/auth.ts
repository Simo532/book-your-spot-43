export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export interface UserRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
  emailVerified: boolean;
  superAdmin: boolean;
}

export interface UserLoginInfosDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface NotificationsPreferenceDTO {
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface AuthTokens {
  'access-token': string;
  'refresh-token': string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  doctorId?: string;
  patientId?: string;
  exp: number;
  [key: string]: unknown;
}
