import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressService, GetStatusPipeModule } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import {
  BaseFormComponentModule,
  FormlyStatusToggleComponentModule,
  FormlyUserComboBoxComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { HeroIconModule, zoomIn } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UpsertOrganizationalUnitComponent } from './components/upsert-organization-unit/upsert-organizational-unit.component';
import { UpsertTenantDialogComponent } from './components/upsert-tenant-dialog/upsert-tenant-dialog.component';
import { UpsertTenantDomainDialogComponent } from './components/upsert-tenant-domain-dialog/upsert-tenant-domain-dialog.component';
import { UpsertTenantFormComponent } from './components/upsert-tenant-form/upsert-tenant-form.component';
import { DomainManagementComponent } from './pages/domain-management/domain-management.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { TenantDetailComponent } from './pages/tenant-detail/tenant-detail.component';
import { TenantManagementComponent } from './pages/tenant-management/tenant-management.component';
import { TenantProfileComponent } from './pages/tenant-profile/tenant-profile.component';
import { GetSpanChartPipe } from './pipes/get-span-chart.pipe';
import { tenantsIcons } from './shared/icons/tenants';

export const ADMIN_TENANTS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_TENANT', redirectTo: '/' } },
    children: [
      { path: '', component: TenantManagementComponent },
      {
        path: ':tenantId',
        component: TenantDetailComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_TENANT', redirectTo: '/' } },
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: TenantProfileComponent },
          { path: 'domains', component: DomainManagementComponent },
          { path: 'org-chart', component: OrganizationalChartComponent },
        ],
      },
    ],
  },
];

const TABS: MenuItem[] = [{ label: 'tenantManagement', link: '/admin/tenants', permissions: [] }];

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
    HeroIconModule.withIcons({ zoomIn }),
    SvgIconsModule.forChild(tenantsIcons),
    TuiScrollbarModule,
    FormlyStatusToggleComponentModule,
    TuiIslandModule,
    FormlyUserComboBoxComponentModule,
  ],
  declarations: [
    TenantManagementComponent,
    UpsertTenantFormComponent,
    UpsertTenantDialogComponent,
    DomainManagementComponent,
    TenantProfileComponent,
    OrganizationalChartComponent,
    UpsertTenantDomainDialogComponent,
    UpsertOrganizationalUnitComponent,
    TenantDetailComponent,
    GetSpanChartPipe,
  ],
  providers: [
    AddressService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'tenants',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
    { provide: HEADER_TABS, useValue: TABS },
  ],
})
export class AdminTenantsModule {}
