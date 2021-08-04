import { TuiDay } from '@taiga-ui/cdk';

export interface LeavePeriod {
  orgId?: string;
  name?: string;
  startDate?: number;
  endDate?: number;
  startDateEdit?: TuiDay | number;
  endDateEdit?: TuiDay | number;
}

export interface ResLeavePeriod {
  code?: string;
  data?: LeavePeriod;
}

