import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiDropdownHoverModule, TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { EmployeesDataTableComponent } from './components/employees-data-table/employees-data-table.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
import { MyTimeRoutingModule } from './human-resource-routing.module';
import { HumanResourceComponent } from './human-resource.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';

@NgModule({
  declarations: [
    HumanResourceComponent,
    EmployeesComponent,
    EmployeesDataTableComponent,
    EmployeeDetailComponent,
    OrganizationChartComponent,
    OrgChartComponent,
  ],
  imports: [
    CommonModule,
    MyTimeRoutingModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    TuiAvatarModule,
    TuiLetModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiActiveZoneModule,
    TuiDropdownModule,
    TuiDropdownHoverModule,
    PolymorpheusModule,
  ],
})
export class HumanResourceModule {}
