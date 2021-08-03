import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { LeaveDetailComponent } from './modules/my-leave/leave-detail/leave-detail.component';
import { LeaveRequestManagementComponent } from './modules/my-leave/leave-request-management/leave-request-management.component';
import { MyLeaveComponent } from './modules/my-leave/my-leave.component';
import { MyLeaveModule } from './modules/my-leave/my-leave.module';
import { ListMyRequestComponent } from './modules/my-request/list-my-request/list-my-request.component';
import { MyRequestsComponent } from './modules/my-request/my-requests.component';
import { MyRequestsModule } from './modules/my-request/my-requests.module';
import { ListRequestManagementComponent } from './modules/request-management/list-request-management/list-request-management.component';
import { RequestManagementComponent } from './modules/request-management/request-management.component';
import { RequestManagementModule } from './modules/request-management/request-management.module';
import { WorkingHourComponent } from './modules/working-hour/working-hour.component';
import { WorkingHourModule } from './modules/working-hour/working-hour.module';
import { MyTimeComponent } from './my-time.component';
import { MyLeaveService } from './services/my-leave.service';

export const myTimeRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'MY_TIME', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: MyTimeComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'my-leave' },
          {
            path: 'my-leave',
            component: MyLeaveComponent,
            children: [
              { path: '', component: LeaveRequestManagementComponent },
              { path: ':id/detail', component: LeaveDetailComponent },
            ],
          },
          {
            path: 'working-hour',
            component: WorkingHourComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_WORKING_HOUR', redirectTo: '/' } },
          },
          {
            path: 'my-request',
            component: MyRequestsComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_MY_REQUEST', redirectTo: '/' } },
            children: [
              { path: '', component: ListMyRequestComponent },
              { path: ':id/detail', component: LeaveDetailComponent },
            ],
          },
          {
            path: 'request-management',
            component: RequestManagementComponent,
            children: [
              { path: '', component: ListRequestManagementComponent },
              { path: ':id/detail', component: LeaveDetailComponent },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [MyTimeComponent, RequestsDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(myTimeRoutes),
    MyLeaveModule,
    MyRequestsModule,
    RequestManagementModule,
    WorkingHourModule,
    TuiButtonModule,
    FormlyModule,
    ReactiveFormsModule,
  ],
  providers: [MyLeaveService],
})
export class MyTimeModule {}
