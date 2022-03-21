export type RecurringType = 'NONE' | 'MONTHLY' | 'YEARLY';

export interface Holiday {
  id: string;
  name: string;
  holidayDate: number | string;
  recurringType: RecurringType;
  paidHoliday: boolean;
  orgId: string;
}
