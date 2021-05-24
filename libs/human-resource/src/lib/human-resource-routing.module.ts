import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { HumanResourceComponent } from './human-resource.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HumanResourceComponent,
        children: [
          { path: '', component: OrganizationChartComponent },
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTimeRoutingModule {}
