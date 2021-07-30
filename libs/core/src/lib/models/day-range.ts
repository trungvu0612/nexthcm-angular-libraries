import { TuiDay } from '@taiga-ui/cdk';

export interface DayRange {
  from: string | Date | TuiDay;
  to: string | Date | TuiDay;
}
