export interface AssignedUser {
  user: {
    id: string;
    username: string;
    image: string;
    dateOfBirth: string;
    status: string;
    team: string;
    phoneNumber: string;
    skype: string;
    email: string;
  };
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
  assignedUser: AssignedUser;
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

export interface ZoneData {
  items: Partial<Zone>[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ZoneResponse {
  code: string;
  data: ZoneData;
}
