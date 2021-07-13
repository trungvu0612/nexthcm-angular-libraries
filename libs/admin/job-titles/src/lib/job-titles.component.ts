import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-job-titles',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitlesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
