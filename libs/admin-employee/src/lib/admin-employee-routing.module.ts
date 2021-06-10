import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '@nexthcm/ui';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{ path: '', component: EmployeeListComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminEmployeeRoutingModule {}
