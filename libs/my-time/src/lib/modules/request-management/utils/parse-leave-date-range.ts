import { format } from 'date-fns';

export function parseLeaveDateRange<
  T extends { durationInDay?: number; fromDate: number; toDate: number; dateRange?: string }
>(item: T): T {
  if (item.durationInDay !== undefined) {
    if (item.durationInDay === 1) {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')}`;
    } else if (item.durationInDay < 1) {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')} (${format(item.fromDate, 'HH:mm')} - ${format(
        item.toDate,
        'HH:mm'
      )})`;
    } else {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')} - ${format(item.toDate, 'MM/dd/yyyy')}`;
    }
  }

  return item;
}
