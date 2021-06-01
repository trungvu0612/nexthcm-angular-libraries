export interface SeatInfo {
  id?: number;
  name?: string;
  team?: string;
  isBirthday?: boolean;
  image?: string;
  status?: string;
  seatNumber?: number;
  left: number;
  top: number;
  isSeat?: boolean;
}

export interface SeatMap {
  building: string;
  dimension: number[];
  seats: SeatInfo[];
}
