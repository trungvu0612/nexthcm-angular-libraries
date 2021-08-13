import { format } from 'date-fns';
import { Type } from '../../../models';

export function parseLeaveDateRange<
  T extends {
    durationInDay?: number;
    fromDate: number;
    toDate: number;
    items?: Type[];
    dateRange?: string;
  }
>(item: T): T {
  if (item.durationInDay !== undefined) {
    if (item.durationInDay === 1) {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')}`;
    } else if (item.durationInDay < 1) {
      if (item.items && item.items[0]?.fromTime && item.items[0]?.toTime) {
        item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')}
            (${format(item.items[0].fromTime, 'HH:MM')} - ${format(item.items[0].toTime, 'HH:MM')})`;
      }
    } else {
      item.dateRange = `${format(item.fromDate, 'MM/dd/yyyy')} - ${format(item.toDate, 'MM/dd/yyyy')}`;
    }
  }
  return item;
}
