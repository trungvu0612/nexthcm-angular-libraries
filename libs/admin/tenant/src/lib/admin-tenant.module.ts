import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiInputDateTimeModule, TuiInputModule, TuiTabsModule } from '@taiga-ui/kit';
import { DomainTenantDataTableComponent } from './components/domain-tenant-data-table/domain-tenant-data-table.component';
import { TenantDataTableComponent } from './components/tenant-data-table/tenant-data-table.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertDomainTenantComponent } from './pages/upsert-domain-tenant/upsert-domain-tenant.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';

export const adminTenantRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TenantListComponent },
      { path: 'add', component: UpsertTenantComponent },
      { path: 'domain/add', component: UpsertDomainTenantComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(adminTenantRoutes),
    TuiInputModule,
    TuiSvgModule,
    TuiTableModule,
    TuiInputDateTimeModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    FormlyModule,
    TuiTablePaginationModule,
    TuiTabsModule,
  ],
  declarations: [
    TenantListComponent,
    TenantDataTableComponent,
    UpsertTenantComponent,
    DomainTenantDataTableComponent,
    UpsertDomainTenantComponent,
  ],
})
export class AdminTenantModule {}
