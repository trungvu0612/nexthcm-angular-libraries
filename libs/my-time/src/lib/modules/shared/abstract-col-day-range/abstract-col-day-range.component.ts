import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LeaveRequest } from '../../../models';
import { SecondsToHourMinutePipeModule } from '../../../pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe';

@Component({
  selector: 'hcm-abstract-col-day-range',
  templateUrl: './abstract-col-day-range.component.html',
  styleUrls: ['./abstract-col-day-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbstractColDayRangeComponent implements OnInit {
  @Input() item!: LeaveRequest;
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  declarations: [AbstractColDayRangeComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SecondsToHourMinutePipeModule,
    TranslocoLocaleModule,
  ],
  exports: [AbstractColDayRangeComponent],
})
export class AbstractColDayRangeComponentModule {}
