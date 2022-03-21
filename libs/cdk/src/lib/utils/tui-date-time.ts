import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { addMilliseconds } from 'date-fns';

export function parseTuiDateTime(value: number | string): [TuiDay, TuiTime] {
  const dateTime = new Date(value);

  return [TuiDay.fromLocalNativeDate(dateTime), TuiTime.fromLocalNativeDate(dateTime)];
}

export function convertTuiDateTimeToLocalDate(dateTime: [TuiDay, TuiTime | null]): Date {
  const [date, time] = dateTime;

  return addMilliseconds(date.toLocalNativeDate(), time ? time.toAbsoluteMilliseconds() : 0);
}
