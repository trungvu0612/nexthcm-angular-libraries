import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

export class DateRange {
  from: Date | string;
  to: Date | string;

  constructor(from: Date | number | string, to: Date | number | string) {
    this.from = new Date(from);
    this.to = new Date(to);
  }

  static fromTuiDayRange(dayRange: TuiDayRange): DateRange {
    return new DateRange(dayRange.from.toLocalNativeDate(), dayRange.to.toLocalNativeDate());
  }

  static toTuiDayRange(range: DateRange): TuiDayRange {
    return new TuiDayRange(
      TuiDay.fromLocalNativeDate(range.from as Date),
      TuiDay.fromLocalNativeDate(range.to as Date)
    );
  }
}
