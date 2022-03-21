import { DateRange } from './date-range';

export interface WorkFromHomeRequestPayload {
  userId: string;
  fromDate?: number;
  toDate?: number;
  comment: string;
  sendToIds: string[];
  stateId: string;
  dateRangeNotContinuous: DateRange[];
}
