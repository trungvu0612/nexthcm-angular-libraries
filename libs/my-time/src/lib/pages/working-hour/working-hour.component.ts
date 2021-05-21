import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-working-hour',
  templateUrl: './working-hour.component.html',
  styleUrls: ['./working-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourComponent implements OnInit {
  workingMeStatus = true;

  constructor() {}

  ngOnInit(): void {}

  workingStatus(type: string) {
    if (type == 'me') {
      this.workingMeStatus = true;
    }
    if (type == 'all') {
      this.workingMeStatus = false;
    }
  }
}
