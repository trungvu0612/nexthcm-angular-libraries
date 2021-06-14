import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-list-timesheet-update',
  templateUrl: './list-timesheet-update.component.html',
  styleUrls: ['./list-timesheet-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTimesheetUpdateComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
