import { BaseObject } from '@nexthcm/cdk';

import { DateRange } from './date-range';

export interface WorkingOnsiteRequestPayload {
  userId: string;
  fromDate?: number;
  toDate?: number;
  sendToIds: string[];
  officeDTO: BaseObject;
  stateId: string;
  dateRangeNotContinuous: DateRange[];
}
