import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-job-level',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobLevelComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
