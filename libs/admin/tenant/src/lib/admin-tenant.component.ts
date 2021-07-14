import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-admin-tenant',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTenantComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.set({
      root: '/admin/tenant',
      tabs: [
        { path: '/information', tabName: 'information' },
        { path: '/organizational-structure', tabName: 'organizationalStructure' },
        { path: '/organizational-chart', tabName: 'organizationalChart' },
      ],
    });
  }
}
