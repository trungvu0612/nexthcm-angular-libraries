import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFileModule, LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiInputDateTimeModule, TuiInputModule } from '@taiga-ui/kit';
import { EmployeeDataTableComponent } from './components/employee-data-table/employee-data-table.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { UpsertEmployeeComponent } from './pages/upsert-employee/upsert-employee.component';

export const adminEmployeeRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'detail/:id', component: EmployeeDetailComponent },
      { path: 'add', component: UpsertEmployeeComponent },
      { path: 'edit/:id', component: UpsertEmployeeComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminEmployeeRoutes),
    TuiInputDateTimeModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    FormlyModule,
    TuiTablePaginationModule,
    GetFileModule,
  ],
  declarations: [EmployeeListComponent, EmployeeDataTableComponent, EmployeeDetailComponent, UpsertEmployeeComponent],
})
export class AdminEmployeeModule {}
