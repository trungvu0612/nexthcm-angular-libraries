import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTimeComponent } from './my-time.component';
import { LayoutComponent } from '@nexthcm/ui';
import { WorkingHourComponent } from './pages/working-hour/working-hour.component';
import { LeaveTypeComponent } from './modules/leave-type/leave-type.component';
import { UpsertLeaveTypeComponent } from './modules/leave-type/pages/upsert-leave-type/upsert-leave-type.component';
import { ListLeaveTypeComponent } from './modules/leave-type/pages/list-leave-type/list-leave-type.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';
import { AuthGuard } from '@nexthcm/auth';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MyTimeComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'leave' },
          { path: 'leave', component: MyLeaveComponent },
          { path: 'working-hour', component: WorkingHourComponent },
          { path: 'request', component: MyRequestComponent },
        ],
      },
      {
        path: 'leave-type',
        component: LeaveTypeComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'list' },
          { path: 'list', component: ListLeaveTypeComponent },
          { path: 'add', component: UpsertLeaveTypeComponent },
          { path: 'edit/:id', component: UpsertLeaveTypeComponent },
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
