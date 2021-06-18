import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import {AdminLayoutComponent} from "@nexthcm/ui";
import {AuthGuard} from "@nexthcm/auth";
import {TuiInputModule} from "@taiga-ui/kit";
import {TenantDataTableComponent} from "./components/tenant-data-table/tenant-data-table.component";
import {TuiSvgModule} from "@taiga-ui/core";
import {TuiTableModule} from "@taiga-ui/addon-table";
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';


export const adminTenantRoutes: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TenantListComponent },
      { path: 'add', component: UpsertTenantComponent }
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
  ],
  declarations: [TenantListComponent, TenantDataTableComponent, UpsertTenantComponent],
})
export class AdminTenantModule {}
