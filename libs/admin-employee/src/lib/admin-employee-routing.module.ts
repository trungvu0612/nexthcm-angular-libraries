import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../../ui/src/lib/admin-layout/admin-layout.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { UpsertEmployeeComponent } from './pages/upsert-employee/upsert-employee.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'detail/:id', component: EmployeeDetailComponent },
      { path: 'add', component: UpsertEmployeeComponent },
      { path: 'edit/:id', component: UpsertEmployeeComponent }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminEmployeeRoutingModule {}
