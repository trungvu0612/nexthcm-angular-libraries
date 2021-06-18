import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { HumanResourceComponent } from './human-resource.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { JobLevelComponent } from './pages/job-level/job-level.component';
import { ListJobLevelComponent } from './pages/job-level/list-job-level/list-job-level.component';
import { UpsertJobLevelComponent } from './pages/job-level/upsert-job-level/upsert-job-level.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HumanResourceComponent,
        children: [
          { path: 'organization-chart', component: OrganizationChartComponent },
          { path: 'employees', component: EmployeesComponent },
          {
            path: 'employees/:id',
            component: EmployeeDetailComponent,
          },
          {
            path: 'job-level',
            component: JobLevelComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'list' },
              { path: 'list', component: ListJobLevelComponent },
              { path: 'add', component: UpsertJobLevelComponent },
              { path: 'edit/:id', component: UpsertJobLevelComponent },
            ],
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
