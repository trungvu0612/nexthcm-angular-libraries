import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import {AdminLayoutComponent} from "@nexthcm/ui";
import {AuthGuard} from "@nexthcm/auth";
import {TuiInputModule} from "@taiga-ui/kit";


export const adminTenantRoutes: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: TenantListComponent }],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule, RouterModule.forChild(adminTenantRoutes), TuiInputModule],
  declarations: [TenantListComponent],
})
export class AdminTenantModule {}
