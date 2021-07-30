import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

export class DateRange {
  from: string;
  to: string;

  constructor(dayRange: TuiDayRange) {
    this.from = dayRange.from.toUtcNativeDate().toUTCString();
    this.to = dayRange.to.toUtcNativeDate().toUTCString();
  }

  static toTuiDayRange(range: DateRange): TuiDayRange {
    return new TuiDayRange(
      TuiDay.fromUtcNativeDate(new Date(range.from)),
      TuiDay.fromUtcNativeDate(new Date(range.to))
    );
  }
}
