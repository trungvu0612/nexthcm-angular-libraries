import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-request-management',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
