import { TuiDay } from '@taiga-ui/cdk';

export interface LeavePeriod {
  orgId?: string;
  name?: string;
  startDate?: number;
  endDate?: number;
  startDateEdit?: Date | TuiDay | number;
  endDateEdit?: Date | TuiDay | number;
}

export interface ResLeavePeriod {
  code?: string;
  data?: LeavePeriod;
}

