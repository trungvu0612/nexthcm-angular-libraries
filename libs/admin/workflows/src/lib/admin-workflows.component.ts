import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-admin-workflows',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminWorkflowsComponent {}
