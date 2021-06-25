import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-admin-policies',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPoliciesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
