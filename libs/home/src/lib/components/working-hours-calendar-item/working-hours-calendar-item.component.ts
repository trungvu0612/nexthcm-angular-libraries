import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WorkingHours } from '@nexthcm/my-time';
import { MonthViewDay } from 'calendar-utils';

@Component({
  selector: 'hcm-working-hours-calendar-item',
  templateUrl: './working-hours-calendar-item.component.html',
  styleUrls: ['./working-hours-calendar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHoursCalendarItemComponent implements OnInit {
  @Input() monthViewDate?: MonthViewDay<WorkingHours>;
  @Input() locale = 'en';

  openDropdown = false;

  constructor() {}

  ngOnInit(): void {}
}
