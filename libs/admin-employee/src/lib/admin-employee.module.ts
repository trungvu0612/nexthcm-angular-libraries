import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminEmployeeRoutingModule } from './admin-employee-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { LayoutModule } from '@nexthcm/ui';

export const adminEmployeeRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, AdminEmployeeRoutingModule, LayoutModule],
  declarations: [
    EmployeeListComponent
  ]
})
export class AdminEmployeeModule {}
