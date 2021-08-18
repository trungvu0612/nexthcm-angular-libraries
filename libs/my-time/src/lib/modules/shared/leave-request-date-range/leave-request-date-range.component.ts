import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { PartialDaysEnum } from '../../../enums';
import { LeaveRequest } from '../../../models';

@Component({
  selector: 'hcm-leave-request-date-range',
  templateUrl: './leave-request-date-range.component.html',
  styleUrls: ['./leave-request-date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveRequestDateRangeComponent {
  PartialDaysEnum?: PartialDaysEnum;
  @Input() @tuiDefaultProp() request!: LeaveRequest;
}

@NgModule({
  declarations: [LeaveRequestDateRangeComponent],
  imports: [CommonModule, TranslocoModule, TranslocoLocaleModule],
  exports: [LeaveRequestDateRangeComponent],
})
export class LeaveRequestDateRangeComponentModule {}
