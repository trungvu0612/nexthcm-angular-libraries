export interface OfficeDetail {
  id: string;
  name: string;
  address: string;
  description: string;
}

export interface Seat {
  id: string;
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
  office: Partial<OfficeDetail>;
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

export type ZoneType = 'office' | 'room';

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
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: number;
}
