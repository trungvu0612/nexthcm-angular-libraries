export interface SeatInfo {
  id?: number;
  image?: string;
  name?: string;
  dateOfBirth?: number;
  status?: string;
  team?: string;
  phoneNumber?: string;
  email?: string;
  skype?: string;
  isSeat?: boolean;
  seatNumber?: number;
  positionX: number;
  positionY: number;
  scaleX?: number;
  scaleY?: number;
}

export interface SeatMap {
  building: string;
  dimensionX?: number;
  dimensionY?: number;
  scaleX: number;
  scaleY: number;
  rounded?: number;
  seats: SeatInfo[];
}
