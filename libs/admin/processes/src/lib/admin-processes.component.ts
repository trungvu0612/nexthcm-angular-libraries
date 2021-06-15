import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-admin-processes',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProcessesComponent {}
