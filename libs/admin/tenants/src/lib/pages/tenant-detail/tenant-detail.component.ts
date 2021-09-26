import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantDetailComponent {
  activeItemIndex = 0;
  readonly items = [
    { caption: 'tenantManagement', routerLink: '/admin/tenant' },
    { caption: 'tenants.editTenant', routerLink: [] },
  ];
}
