import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { EmployeesDataTableComponent } from './components/employees-data-table/employees-data-table.component';
import { MyTimeRoutingModule } from './human-resource-routing.module';
import { HumanResourceComponent } from './human-resource.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeesComponent } from './pages/employees/employees.component';

@NgModule({
  declarations: [HumanResourceComponent, EmployeesComponent, EmployeesDataTableComponent, EmployeeDetailComponent],
  imports: [
    CommonModule,
    MyTimeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
  ],
})
export class HumanResourceModule {}
