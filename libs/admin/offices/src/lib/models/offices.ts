import { Dimension, Zone } from '@nexthcm/ui';

export type ZoneType = 'office' | 'seatMap';

export interface SeatMapForm extends Dimension {
  office: Partial<Zone> | null;
  name: string;
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: number;
}
