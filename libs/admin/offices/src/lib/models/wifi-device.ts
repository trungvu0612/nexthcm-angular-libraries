import { CommonStatus, Office } from '@nexthcm/cdk';

export interface WifiDevice {
  id: string;
  wifiSSID: string;
  macAddress: string;
  description: string;
  officeId: string;
  state: CommonStatus;
  office: Office;
}
