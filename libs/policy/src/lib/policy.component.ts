import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-policy-layout',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.set({
      root: '/policy',
      tabs: [
        { path: '', tabName: 'policy' },
        { path: '/updated', tabName: 'updated' },
      ],
    });
  }
}
