import { BaseObject } from '@nexthcm/cdk';

export interface WorkingOnsiteRequestPayload {
  fromDate: number;
  toDate: number;
  sendTo: string;
  /**
   * Duration in seconds
   */
  duration: number;
  officeDTO: BaseObject;
}
