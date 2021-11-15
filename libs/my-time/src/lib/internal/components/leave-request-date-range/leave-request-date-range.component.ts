import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { tuiDefaultProp, TuiLetModule } from '@taiga-ui/cdk';
import { PartialDays } from '../../enums';
import { LeaveRequest } from '../../models';

@Component({
  selector: 'hcm-leave-request-date-range',
  templateUrl: './leave-request-date-range.component.html',
  styleUrls: ['./leave-request-date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveRequestDateRangeComponent {
  @Input() @tuiDefaultProp() data!: LeaveRequest;

  readonly PartialDay = PartialDays;
}

@NgModule({
  declarations: [LeaveRequestDateRangeComponent],
  imports: [CommonModule, TranslocoModule, TranslocoLocaleModule, TuiLetModule],
  exports: [LeaveRequestDateRangeComponent],
})
export class LeaveRequestDateRangeComponentModule {}
