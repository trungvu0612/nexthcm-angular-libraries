import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RejectDialogComponent } from './components/reject-dialog/reject-dialog.component';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { LeaveRequestManagementComponent } from './modules/my-leave/leave-request-management/leave-request-management.component';
import { MyLeaveComponent } from './modules/my-leave/my-leave.component';
import { MyLeaveModule } from './modules/my-leave/my-leave.module';
import { ListMyRequestComponent } from './modules/my-request/list-my-request/list-my-request.component';
import { MyRequestsComponent } from './modules/my-request/my-requests.component';
import { MyRequestsModule } from './modules/my-request/my-requests.module';
import { LeaveRequestListComponent } from './modules/request-management/pages/leave-request-list/leave-request-list.component';
import { UpdateTimesheetRequestListComponent } from './modules/request-management/pages/update-timesheet-request-list/update-timesheet-request-list.component';
import { WorkFormHomeRequestListComponent } from './modules/request-management/pages/work-form-home-request-list/work-form-home-request-list.component';
import { WorkingAfterHoursRequestListComponent } from './modules/request-management/pages/working-after-hours-request-list/working-after-hours-request-list.component';
import { WorkingOutsideRequestListComponent } from './modules/request-management/pages/working-outside-request-list/working-outside-request-list.component';
import { RequestManagementComponent } from './modules/request-management/request-management.component';
import { RequestManagementModule } from './modules/request-management/request-management.module';
import { EveryoneWorkingHoursListComponent } from './modules/working-hours/components/everyone-working-hours-list/everyone-working-hours-list.component';
import { OnlyMeWorkingHoursListComponent } from './modules/working-hours/components/only-me-working-hours-list/only-me-working-hours-list.component';
import { WorkingHoursComponent } from './modules/working-hours/working-hours.component';
import { WorkingHoursModule } from './modules/working-hours/working-hours.module';
import { MyTimeComponent } from './my-time.component';
import { SecondsToHourMinutePipeModule } from './pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe';
import { MyLeaveService, MyRequestService, MyTimeService, WorkingHoursService } from './services';

export const MY_TIME_ROUTES: Routes = [
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
            children: [{ path: '', component: LeaveRequestManagementComponent }],
          },
          {
            path: 'working-hours',
            component: WorkingHoursComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_WORKING_HOUR', redirectTo: '/' } },
            children: [
              { path: 'only-me', component: OnlyMeWorkingHoursListComponent },
              { path: 'everyone', component: EveryoneWorkingHoursListComponent },
              { path: '', redirectTo: 'only-me', pathMatch: 'full' },
            ],
          },
          {
            path: 'my-request',
            component: MyRequestsComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_MY_REQUEST', redirectTo: '/' } },
            children: [{ path: '', component: ListMyRequestComponent }],
          },
          {
            path: 'requests',
            component: RequestManagementComponent,
            children: [
              { path: 'leave', component: LeaveRequestListComponent },
              { path: 'working-after-hours', component: WorkingAfterHoursRequestListComponent },
              { path: 'update-timesheet', component: UpdateTimesheetRequestListComponent },
              { path: 'working-outside', component: WorkingOutsideRequestListComponent },
              { path: 'work-from-home', component: WorkFormHomeRequestListComponent },
              { path: '', redirectTo: 'leave', pathMatch: 'full' },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [MyTimeComponent, RejectDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(MY_TIME_ROUTES),
    MyLeaveModule,
    MyRequestsModule,
    RequestManagementModule,
    WorkingHoursModule,
    TuiButtonModule,
    FormlyModule,
    ReactiveFormsModule,
    TranslocoLocaleModule,
    SecondsToHourMinutePipeModule,
  ],
  providers: [MyLeaveService, MyTimeService, WorkingHoursService, MyRequestService],
})
export class MyTimeModule {}
