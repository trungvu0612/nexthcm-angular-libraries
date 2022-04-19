import { TuiDay } from '@taiga-ui/cdk';

export type RecurringType = 'NONE' | 'MONTHLY' | 'YEARLY';

export interface Holiday {
  id: string;
  name: string;
  holidayDate: number | string;
  recurringType: RecurringType;
  paidHoliday: boolean;
  orgId: string;
}

export interface HolidayForm extends Omit<Holiday, 'holidayDate'> {
  holidayDate: number | TuiDay;
}
