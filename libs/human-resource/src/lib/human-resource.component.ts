import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-human-resource',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HumanResourceComponent {
  constructor(headerService: HeaderService) {
    headerService.set({
      root: '/human-resource',
      tabs: [
        { path: '/organization-chart', tabName: 'organizationChart' },
        { path: '/employees', tabName: 'employees' },
      ],
    });
  }
}
