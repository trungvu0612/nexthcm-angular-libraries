import { WorkingAfterHoursType } from '../../enums';

export interface WorkingAfterHoursRequestPayload {
  userId: string;
  type: WorkingAfterHoursType;
  /**
   * Duration in seconds
   */
  duration: number;
  fromDate: number;
  toDate: number;
  comment: string;
  sendTo: string;
}
