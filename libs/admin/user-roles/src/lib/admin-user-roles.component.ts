import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-admin-user-roles',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserRolesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
