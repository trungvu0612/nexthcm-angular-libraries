import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-admin-tenant-summary',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTenantSummaryComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.set({
      root: '/admin/tenant',
      tabs: [{ path: '', tabName: 'tenantManagement' }],
    });
  }
}
