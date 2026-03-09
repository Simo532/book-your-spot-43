export interface TagResponseDto {
  id: string;
  name: string;
  specialityId?: string;
}

export interface TagRequestDto {
  name: string;
  specialityId: string;
}
