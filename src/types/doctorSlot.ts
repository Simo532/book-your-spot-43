export enum ConsultationType {
  IN_PERSON = 'IN_PERSON',
  ONLINE = 'ONLINE',
  BOTH = 'BOTH',
}

export interface DoctorSlotDTO {
  id?: string;
  dayOfWeek: string; // MONDAY, TUESDAY, etc.
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  enabled: boolean;
  consultationType: ConsultationType;
  doctorId: string;
}
