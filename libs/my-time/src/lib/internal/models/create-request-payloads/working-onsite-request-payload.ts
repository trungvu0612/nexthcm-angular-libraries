import { BaseObject } from '@nexthcm/cdk';

export interface WorkingOnsiteRequestPayload {
  userId: string;
  fromDate: number;
  toDate: number;
  sendTo: string;
  /**
   * Duration in seconds
   */
  duration: number;
  officeDTO: BaseObject;
}
