import { DateRange } from './date-range';

export interface WorkFromHomeRequestPayload {
  userId: string;
  fromDate?: number;
  toDate?: number;
  comment: string;
  sendTo: string;
  stateId: string;
  dateRangeNotContinuous: DateRange[];
}
