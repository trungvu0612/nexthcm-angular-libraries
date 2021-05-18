import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HumanResourceComponent } from './human-resource.component';
import { MyTimeRoutingModule } from './human-resource-routing.module';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeesDataTableComponent } from './components/employees-data-table/employees-data-table.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { TuiSvgModule } from '@taiga-ui/core';

@NgModule({
  declarations: [HumanResourceComponent, EmployeesComponent, EmployeesDataTableComponent, EmployeeDetailComponent],
  imports: [CommonModule, MyTimeRoutingModule, ReactiveFormsModule, TuiInputModule, TuiTableModule, TuiSvgModule],
})
export class HumanResourceModule {}
