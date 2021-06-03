import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminEmployeeRoutingModule } from './admin-employee-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';

export const adminEmployeeRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, AdminEmployeeRoutingModule],
  declarations: [
    EmployeeListComponent
  ],
})
export class AdminEmployeeModule {}
