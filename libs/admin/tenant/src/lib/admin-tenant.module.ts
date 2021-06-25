import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import {AdminLayoutComponent} from "@nexthcm/ui";
import {AuthGuard} from "@nexthcm/auth";
import {TuiInputDateTimeModule, TuiInputModule, TuiTabsModule} from "@taiga-ui/kit";
import {TenantDataTableComponent} from "./components/tenant-data-table/tenant-data-table.component";
import {TuiSvgModule} from "@taiga-ui/core";
import {TuiTableModule, TuiTablePaginationModule} from "@taiga-ui/addon-table";
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import { DomainTenantDataTableComponent } from './components/domain-tenant-data-table/domain-tenant-data-table.component';
import { UpsertDomainTenantComponent } from './pages/upsert-domain-tenant/upsert-domain-tenant.component';


export const adminTenantRoutes: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TenantListComponent },
      { path: 'add', component: UpsertTenantComponent },
      { path: 'domain/add', component: UpsertDomainTenantComponent }
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
  declarations: [TenantListComponent, TenantDataTableComponent, UpsertTenantComponent, DomainTenantDataTableComponent, UpsertDomainTenantComponent],
})
export class AdminTenantModule {}
