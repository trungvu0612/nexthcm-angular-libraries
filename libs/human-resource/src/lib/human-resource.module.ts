import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
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
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EmployeesDataTableComponent } from './components/employees-data-table/employees-data-table.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
import { HumanResourceComponent } from './human-resource.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';

export const humanResourceRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'HUMAN_RESOURCE', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: HumanResourceComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'organization-chart' },
          { path: 'organization-chart', component: OrganizationChartComponent },
          { path: 'employees', component: EmployeesComponent },
          {
            path: 'employees/:id',
            component: EmployeeDetailComponent,
          },
        ],
      },
    ],
  },
];

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
    RouterModule.forChild(humanResourceRoutes),
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
