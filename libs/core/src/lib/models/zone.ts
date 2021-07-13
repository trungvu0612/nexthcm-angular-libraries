import { User } from './user';

export interface Dimension {
  width: number;
  height: number;
  rounded: number;
}

export interface StyleSeat extends Partial<Dimension> {
  positionX: number;
  positionY: number;
}

export interface Seat extends StyleSeat {
  id: string;
  label: string;
  assignedUser: Partial<User> | null;
  style: string;
}

export interface Zone {
  id: string;
  name: string;
  status: number;
  longitude: number;
  latitude: number;
  adder: string;
  description: string;
  address: string;
  type: string;
  office: Partial<Zone>;
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: Partial<Seat>[];
}
