import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { LeaveTypeComponent } from './modules/leave-type/leave-type.component';
import { LeaveTypeModule } from './modules/leave-type/leave-type.module';
import { ListLeaveTypeComponent } from './modules/leave-type/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './modules/leave-type/upsert-leave-type/upsert-leave-type.component';
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
import { ReactiveFormsModule } from '@angular/forms';

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
              {
                path: 'add',
                component: UpsertLeaveTypeComponent,
                canActivate: [NgxPermissionsGuard],
                data: { permissions: { only: 'CREATE_MY_REQUEST', redirectTo: '/' } },
              },
              {
                path: 'edit/:id',
                component: UpsertLeaveTypeComponent,
                canActivate: [NgxPermissionsGuard],
                data: { permissions: { only: 'UPDATE_MY_REQUEST', redirectTo: '/' } },
              },
              { path: ':id/detail', component: LeaveDetailComponent },
            ],
          },
          {
            path: 'request-management',
            component: RequestManagementComponent,
            children: [
              { path: '', component: ListRequestManagementComponent },
              // { path: 'add', component: UpsertLeaveTypeComponent },
              { path: ':id/detail', component: LeaveDetailComponent },
            ],
          },
        ],
      },
      {
        path: 'leave-type',
        component: LeaveTypeComponent,
        children: [
          { path: '', component: ListLeaveTypeComponent },
          { path: 'add', component: UpsertLeaveTypeComponent },
          { path: 'edit/:id', component: UpsertLeaveTypeComponent },
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
    LeaveTypeModule,
    MyLeaveModule,
    MyRequestsModule,
    RequestManagementModule,
    WorkingHourModule,
    TuiButtonModule,
    FormlyModule,
    ReactiveFormsModule,
    PromptComponentModule
  ],
  providers: [MyLeaveService],
})
export class MyTimeModule {}
