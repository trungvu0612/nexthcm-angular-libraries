import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-admin-branch',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBranchesComponent {}
