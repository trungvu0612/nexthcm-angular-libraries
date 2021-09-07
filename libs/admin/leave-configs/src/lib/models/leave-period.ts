import { TuiDay } from '@taiga-ui/cdk';

export interface LeavePeriod {
  id: string;
  orgId?: string;
  name: string;
  startDate: TuiDay | number;
  endDate: TuiDay | number;
  status: number;
}

export interface ResLeavePeriod {
  code?: string;
  data?: LeavePeriod;
}

