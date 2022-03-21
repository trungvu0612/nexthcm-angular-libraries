import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkflowStatus } from '@nexthcm/cdk';
import { LeaveRequest } from '@nexthcm/my-time';
import { tuiDefaultProp } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-leave-calendar-date-item',
  templateUrl: './leave-calendar-date-item.component.html',
  styleUrls: ['./leave-calendar-date-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveCalendarDateItemComponent {
  @Input() @tuiDefaultProp() leaveItem = {} as LeaveRequest;
  @Output() changeStatus = new EventEmitter<WorkflowStatus>();

  openDropdown = false;
  openActions = false;
}
