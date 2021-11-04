import { CommonStatus } from '../enums';

export interface Office {
  id: string;
  name: string;
  status: CommonStatus;
  address: string;
  description: string;
  longitude: number;
  latitude: number;
  tenantId: string;
  onsite: boolean;
}
