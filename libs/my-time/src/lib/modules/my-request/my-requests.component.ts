import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-my-requests',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRequestsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
