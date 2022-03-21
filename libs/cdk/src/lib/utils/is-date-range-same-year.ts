import { TuiDayRange } from '@taiga-ui/cdk';
import { isSameYear } from 'date-fns';

export function isDateRangeSameYear(dateRange: TuiDayRange): boolean {
  return dateRange && isSameYear(dateRange.from.toLocalNativeDate(), dateRange.to.toLocalNativeDate());
}
