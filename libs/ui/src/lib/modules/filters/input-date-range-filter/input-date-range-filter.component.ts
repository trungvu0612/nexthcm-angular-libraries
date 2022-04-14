import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputDateRangeModule } from '@taiga-ui/kit';
import { endOfMonth, startOfMonth } from 'date-fns';
import omit from 'just-omit';

@Component({
  selector: 'hcm-input-date-range-filter',
  templateUrl: './input-date-range-filter.component.html',
  styleUrls: ['./input-date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangeFilterComponent implements OnInit {
  @Input() title = 'dateRange';
  @Output() datesChange = new EventEmitter<TuiDayRange>();

  dateRange: TuiDayRange | null = null;

  constructor(
    private readonly locationRef: Location,
    private readonly urlSerializer: UrlSerializer,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  private _defaultValue?: TuiDayRange;

  @Input()
  set defaultValue(value: unknown) {
    if (coerceBooleanProperty(value)) {
      const now = new Date();
      this._defaultValue = new TuiDayRange(
        TuiDay.fromLocalNativeDate(startOfMonth(now)),
        TuiDay.fromLocalNativeDate(endOfMonth(now))
      );
    }
  }

  ngOnInit(): void {
    const dateRangeString: string = this.activatedRoute.snapshot.queryParams['dates'];

    if (dateRangeString) {
      this.dateRange = TuiDayRange.normalizeParse(dateRangeString);
    } else if (this._defaultValue) this.onDatesChange(this._defaultValue);
  }

  onDatesChange(value: TuiDayRange): void {
    this.dateRange = value;
    this.datesChange.emit(value);

    const tree = this.urlSerializer.parse(this.locationRef.path());

    tree.queryParams =
      value === null
        ? omit(tree.queryParams, 'dates')
        : { ...tree.queryParams, dates: value.getFormattedDayRange('DMY', '.') };
    this.locationRef.go(String(tree));
  }
}

@NgModule({
  declarations: [InputDateRangeFilterComponent],
  imports: [TuiInputDateRangeModule, FormsModule, TranslocoModule, TuiTextfieldControllerModule],
  exports: [InputDateRangeFilterComponent],
})
export class InputDateRangeFilterComponentModule {}
