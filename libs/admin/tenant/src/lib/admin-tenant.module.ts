import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddressService, GetStatusPipeModule } from '@nexthcm/cdk';
import { FormlyUserComboBoxComponentModule, HEADER_TABS, LayoutComponent, MenuItem } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiIslandModule, TuiSliderModule, TuiTagModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { HeroIconModule, pencilAlt, trash, zoomIn } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { HasTenantIdGuard } from './guards/has-tenant-id.guard';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';

export const adminTenantRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_TENANT', redirectTo: '/' } },
    children: [
      { path: '', component: TenantListComponent },
      {
        path: 'create',
        component: UpsertTenantComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_TENANT', redirectTo: '/' } },
      },
      {
        path: '',
        canActivate: [NgxPermissionsGuard, HasTenantIdGuard],
        data: { permissions: { only: 'UPDATE_TENANT', redirectTo: '/' } },
        children: [
          { path: 'detail', component: UpsertTenantComponent },
          { path: 'domain', component: DomainListComponent },
          { path: 'organizational-structure', component: OrganizationalStructureComponent },
          { path: 'organizational-chart', component: OrganizationalChartComponent },
        ],
      },
    ],
  },
];
const TABS: MenuItem[] = [
  { label: 'information', link: '/admin/tenant/detail', permissions: [] },
  { label: 'domain', link: '/admin/tenant/domain', permissions: [] },
  { label: 'organizationalStructure', link: '/admin/tenant/organizational-structure', permissions: [] },
  { label: 'organizationalChart', link: '/admin/tenant/organizational-chart', permissions: [] },
];

@NgModule({
  declarations: [
    TenantListComponent,
    DomainListComponent,
    UpsertTenantComponent,
    OrganizationalStructureComponent,
    OrganizationalChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminTenantRoutes),
    ReactiveFormsModule,
    FormlyModule,
    TranslocoModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiInputModule,
    TuiSvgModule,
    GetStatusPipeModule,
    TuiTagModule,
    TuiTextfieldControllerModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiAvatarModule,
    TableModule,
    TuiScrollbarModule,
    TuiLetModule,
    HeroIconModule.withIcons({ pencilAlt, trash, zoomIn }),
    TuiSliderModule,
    TuiLoaderModule,
    PolymorpheusModule,
    FormlyUserComboBoxComponentModule,
  ],
  providers: [AddressService, { provide: HEADER_TABS, useValue: TABS }],
})
export class AdminTenantModule {}
