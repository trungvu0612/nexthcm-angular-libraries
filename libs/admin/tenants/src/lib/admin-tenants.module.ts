import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressService, GetStatusPipeModule } from '@nexthcm/cdk';
import { BaseFormComponentModule, InputFilterComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { UpsertOrganizationUnitComponent } from './components/upsert-organization-unit/upsert-organization-unit.component';
import { UpsertTenantDialogComponent } from './components/upsert-tenant-dialog/upsert-tenant-dialog.component';
import { UpsertTenantDomainDialogComponent } from './components/upsert-tenant-domain-dialog/upsert-tenant-domain-dialog.component';
import { UpsertTenantFormComponent } from './components/upsert-tenant-form/upsert-tenant-form.component';
import { DomainManagementComponent } from './page/domain-management/domain-management.component';
import { OrganizationalChartComponent } from './page/organizational-chart/organizational-chart.component';
import { TenantManagementComponent } from './page/tenant-management/tenant-management.component';
import { TenantProfileComponent } from './page/tenant-profile/tenant-profile.component';
import { TenantDetailComponent } from './page/tenant-detail/tenant-detail.component';

export const ADMIN_TENANTS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TenantManagementComponent },
      {
        path: ':tenantId',
        component: TenantDetailComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: TenantProfileComponent },
          { path: 'domains', component: DomainManagementComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_TENANTS_ROUTES),
    LayoutModule,
    TranslocoModule,
    TuiButtonModule,
    InputFilterComponentModule,
    TuiLoaderModule,
    TableModule,
    TuiLetModule,
    TuiTablePaginationModule,
    TuiTagModule,
    GetStatusPipeModule,
    TuiLinkModule,
    BaseFormComponentModule,
    LetModule,
    TuiTabsModule,
  ],
  declarations: [
    TenantManagementComponent,
    UpsertTenantFormComponent,
    UpsertTenantDialogComponent,
    DomainManagementComponent,
    TenantProfileComponent,
    OrganizationalChartComponent,
    UpsertTenantDomainDialogComponent,
    UpsertOrganizationUnitComponent,
    TenantDetailComponent,
  ],
  providers: [AddressService],
})
export class AdminTenantsModule {}
