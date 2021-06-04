import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-policy-layout',
  template: ` <hcm-header></hcm-header>
    <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyLayoutComponent {}
