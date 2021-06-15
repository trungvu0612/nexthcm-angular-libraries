export interface OfficeDetail {
  id: string;
  name: string;
  address: string;
  description: string;
}

export interface Zone {
  id: string;
  name: string;
  adder: string;
  description: string;
  address: string;
  numberOfRoom: number;
  office: Partial<OfficeDetail>;
}

export interface Seat {
  id: string;
  style: string;
}

export interface SeatZone extends Zone {
  imageUrl: string;
  seats: Partial<Seat>[];
}

export interface SeatZoneResponse {
  items: Partial<SeatZone>[];
  totalElements: number;
  totalPages: number;
}

export interface StyleSeat {
  positionX: number;
  positionY: number;
  width?: number;
  height?: number;
  rounded?: number;
}

export interface Dimension {
  width: number;
  height: number;
  rounded: number;
}

export interface SeatMapForm extends Dimension {
  office: string;
  name: string;
  image: string;
  seats: number;
}
