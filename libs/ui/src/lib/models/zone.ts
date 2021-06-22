export interface User {
  id: string;
  username: string;
  image: string;
  dateOfBirth: string;
  status: string;
  team: string;
  phoneNumber: string;
  skype: string;
  email: string;
}

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
  assignedUser: User;
  style: string;
}

export interface Zone {
  id: string;
  name: string;
  adder: string;
  description: string;
  address: string;
  numberOfRoom: number;
  type: string;
  office: Partial<Zone>;
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: Partial<Seat>[];
}
