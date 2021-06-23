import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { LeaveTypeComponent } from './modules/leave-type/leave-type.component';
import { ListLeaveTypeComponent } from './modules/leave-type/pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './modules/leave-type/pages/upsert-leave-type/upsert-leave-type.component';
import { MyRequestsComponent } from './modules/my-request/my-requests.component';
import { ListMyRequestComponent } from './modules/my-request/pages/list-my-request/list-my-request.component';
import { MyTimeComponent } from './my-time.component';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';
import { WorkingHourComponent } from './pages/working-hour/working-hour.component';
import { RequestManagementComponent } from './modules/request-management/request-management.component';
import { ListRequestManagementComponent } from './modules/request-management/pages/list-request-management/list-request-management.component';

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
          { path: '', pathMatch: 'full', redirectTo: 'my-leave' },
          { path: 'my-leave', component: MyLeaveComponent },
          { path: 'working-hour', component: WorkingHourComponent },
          {
            path: 'my-request', component: MyRequestsComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'list' },
              { path: 'list', component: ListMyRequestComponent },
              { path: 'add', component: UpsertLeaveTypeComponent },
              { path: 'edit/:id', component: UpsertLeaveTypeComponent }
            ]
          },
          {
            path: 'request-management', component: RequestManagementComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'list' },
              { path: 'list', component: ListRequestManagementComponent },
              // { path: 'add', component: UpsertLeaveTypeComponent },
              // { path: 'edit/:id', component: UpsertLeaveTypeComponent }
            ]
          }
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
