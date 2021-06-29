import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-policy-layout',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyComponent {
}
