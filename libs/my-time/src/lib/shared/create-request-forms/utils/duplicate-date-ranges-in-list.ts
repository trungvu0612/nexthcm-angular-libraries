import { isPresent, TuiDayRange } from '@taiga-ui/cdk';

export function isDuplicateDateRangeInList(
  dateRangeCheck: TuiDayRange,
  dateRanges: { fromTo: TuiDayRange }[]
): boolean {
  const cleanedDateRanges = dateRanges.filter(isPresent);
  const index = cleanedDateRanges.findIndex((range) => range.fromTo.daySame(dateRangeCheck));

  if (index > -1) {
    cleanedDateRanges.splice(index, 1);
  }
  for (const dateRange of cleanedDateRanges) {
    if (
      (dateRangeCheck.from.daySameOrAfter(dateRange.fromTo.from) &&
        dateRangeCheck.from.daySameOrBefore(dateRange.fromTo.to)) ||
      (dateRangeCheck.to.daySameOrAfter(dateRange.fromTo.from) &&
        dateRangeCheck.to.daySameOrBefore(dateRange.fromTo.to))
    ) {
      return true;
    }
  }
  return false;
}
