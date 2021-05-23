export interface SeatInfo {
  id: number;
  name: string;
  cif: string;
  team: string;
  isBirthday: boolean;
  status: string;
}

export interface Dispatch<T> {
  type: string;
  payload?: T;
}
