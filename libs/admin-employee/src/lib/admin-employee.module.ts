import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import {TuiTableModule, TuiTablePaginationModule} from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiInputDateTimeModule, TuiInputModule } from '@taiga-ui/kit';
import { AdminEmployeeRoutingModule } from './admin-employee-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeDataTableComponent } from './components/employee-data-table/employee-data-table.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { UpsertEmployeeComponent } from './pages/upsert-employee/upsert-employee.component';

export const adminEmployeeRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminEmployeeRoutingModule,
    TuiInputDateTimeModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    FormlyModule,
    TuiTablePaginationModule,
  ],
  declarations: [EmployeeListComponent, EmployeeDataTableComponent, EmployeeDetailComponent, UpsertEmployeeComponent],
})
export class AdminEmployeeModule {}
