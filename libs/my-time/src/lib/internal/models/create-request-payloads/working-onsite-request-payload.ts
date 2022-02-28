import { BaseObject } from '@nexthcm/cdk';

import { DateRange } from './date-range';

export interface WorkingOnsiteRequestPayload {
  userId: string;
  fromDate?: number;
  toDate?: number;
  sendTo: string;
  officeDTO: BaseObject;
  stateId: string;
  dateRangeNotContinuous: DateRange[];
}
