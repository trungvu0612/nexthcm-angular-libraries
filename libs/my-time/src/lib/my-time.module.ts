import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { HEADER_TABS, LayoutComponent, MenuItem } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { MyLeaveComponent } from './modules/my-leave/my-leave.component';
import { MyLeaveModule } from './modules/my-leave/my-leave.module';
import { MyRequestsComponent } from './modules/my-requests/my-requests.component';
import { MyRequestsModule } from './modules/my-requests/my-requests.module';
import { MyUpdateTimesheetRequestsComponent } from './modules/my-requests/pages/my-update-timesheet-requests/my-update-timesheet-requests.component';
import { MyWorkFromHomeRequestsComponent } from './modules/my-requests/pages/my-work-from-home-requests/my-work-from-home-requests.component';
import { MyWorkingAfterHoursRequestsComponent } from './modules/my-requests/pages/my-working-after-hours-requests/my-working-after-hours-requests.component';
import { MyWorkingOutsideRequestsComponent } from './modules/my-requests/pages/my-working-outside-requests/my-working-outside-requests.component';
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
import { MyTimeService } from './services';

export const MY_TIME_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'MY_TIME', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'my-leave' },
      { path: 'my-leave', component: MyLeaveComponent },
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
        path: 'my-requests',
        component: MyRequestsComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'VIEW_MY_REQUEST', redirectTo: '/' } },
        children: [
          { path: 'working-after-hours', component: MyWorkingAfterHoursRequestsComponent },
          { path: 'update-timesheet', component: MyUpdateTimesheetRequestsComponent },
          { path: 'working-outside', component: MyWorkingOutsideRequestsComponent },
          { path: 'work-from-home', component: MyWorkFromHomeRequestsComponent },
          { path: '', redirectTo: 'working-after-hours', pathMatch: 'full' },
        ],
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
];
const TABS: MenuItem[] = [
  { label: 'myTime.myLeave', link: '/my-time/my-leave', permissions: [] },
  { label: 'myTime.workingHours', link: '/my-time/working-hours', permissions: [] },
  { label: 'myTime.myRequest', link: '/my-time/my-requests', permissions: [] },
  { label: 'myTime.requestManagement', link: '/my-time/requests', permissions: [] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(MY_TIME_ROUTES),
    MyLeaveModule,
    MyRequestsModule,
    RequestManagementModule,
    WorkingHoursModule,
  ],
  providers: [
    MyTimeService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'myTime',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
    { provide: HEADER_TABS, useValue: TABS }
  ],
})
export class MyTimeModule {}
