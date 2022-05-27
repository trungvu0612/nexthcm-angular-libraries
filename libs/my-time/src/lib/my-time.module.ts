import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormlyMentionEditorComponentModule, HEADER_TABS, LayoutComponent, MenuItem } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TranslocoDatePipe } from '@ngneat/transloco-locale';
import { NgxPermissionsGuard } from 'ngx-permissions';

import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { MyRequestsService, RequestDetailDialogService } from './internal/services';
import { MyLeaveComponent } from './modules/my-leave/my-leave.component';
import { MyLeaveModule } from './modules/my-leave/my-leave.module';
import { MyRequestsComponent } from './modules/my-requests/my-requests.component';
import { MyRequestsModule } from './modules/my-requests/my-requests.module';
import { MyTransferLeaveEntitlementsRequestsComponent } from './modules/my-requests/pages/my-transfer-leave-entitlements-requests/my-transfer-leave-entitlements-requests.component';
import { MyUpdateTimesheetRequestsComponent } from './modules/my-requests/pages/my-update-timesheet-requests/my-update-timesheet-requests.component';
import { MyWorkFromHomeRequestsComponent } from './modules/my-requests/pages/my-work-from-home-requests/my-work-from-home-requests.component';
import { MyWorkingAfterHoursRequestsComponent } from './modules/my-requests/pages/my-working-after-hours-requests/my-working-after-hours-requests.component';
import { MyWorkingOnsiteRequestsComponent } from './modules/my-requests/pages/my-working-onsite-requests/my-working-onsite-requests.component';
import { LeaveRequestListComponent } from './modules/request-management/pages/leave-request-list/leave-request-list.component';
import { TransferLeaveEntitlementsRequestListComponent } from './modules/request-management/pages/transfer-leave-entitlements-request-list/transfer-leave-entitlements-request-list.component';
import { UpdateTimesheetRequestListComponent } from './modules/request-management/pages/update-timesheet-request-list/update-timesheet-request-list.component';
import { WorkFormHomeRequestListComponent } from './modules/request-management/pages/work-form-home-request-list/work-form-home-request-list.component';
import { WorkingAfterHoursRequestListComponent } from './modules/request-management/pages/working-after-hours-request-list/working-after-hours-request-list.component';
import { WorkingOnsiteRequestListComponent } from './modules/request-management/pages/working-onsite-request-list/working-onsite-request-list.component';
import { RequestManagementComponent } from './modules/request-management/request-management.component';
import { RequestManagementModule } from './modules/request-management/request-management.module';
import { EveryoneWorkingHoursListComponent } from './modules/working-hours/components/everyone-working-hours-list/everyone-working-hours-list.component';
import { OnlyMeWorkingHoursListComponent } from './modules/working-hours/components/only-me-working-hours-list/only-me-working-hours-list.component';
import { WorkingHoursComponent } from './modules/working-hours/working-hours.component';
import { WorkingHoursModule } from './modules/working-hours/working-hours.module';
import { FormlyAssigneeComponentModule } from './shared/formly-direct-supervisor/formly-assignee.component';

export const MY_TIME_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'MY_TIME', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'my-leave' },
      {
        path: 'my-leave',
        component: MyLeaveComponent,
      },
      {
        path: 'working-hours',
        component: WorkingHoursComponent,
        canActivateChild: [NgxPermissionsGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'only-me' },
          {
            path: 'only-me',
            component: OnlyMeWorkingHoursListComponent,
            data: { permissions: { only: 'VIEW_WORKING_HOUR_ONLYME', redirectTo: '/' } },
          },
          {
            path: 'everyone',
            component: EveryoneWorkingHoursListComponent,
            data: {
              permissions: { only: ['VIEW_WORKING_HOUR_EVERYONE', 'VIEW_SUBORDINATE_REQUEST'], redirectTo: '/' },
            },
          },
        ],
      },
      {
        path: 'my-requests',
        component: MyRequestsComponent,
        children: [
          { path: 'working-after-hours', component: MyWorkingAfterHoursRequestsComponent },
          { path: 'update-timesheet', component: MyUpdateTimesheetRequestsComponent },
          { path: 'working-onsite', component: MyWorkingOnsiteRequestsComponent },
          { path: 'work-from-home', component: MyWorkFromHomeRequestsComponent },
          { path: 'transfer-leave-entitlements', component: MyTransferLeaveEntitlementsRequestsComponent },
          { path: '', redirectTo: 'working-after-hours', pathMatch: 'full' },
        ],
      },
      {
        path: 'requests',
        component: RequestManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: ['VIEW_REQUEST_MANAGEMENT', 'VIEW_SUBORDINATE_REQUEST'], redirectTo: '/' } },
        children: [
          { path: 'leave', component: LeaveRequestListComponent },
          { path: 'working-after-hours', component: WorkingAfterHoursRequestListComponent },
          { path: 'update-timesheet', component: UpdateTimesheetRequestListComponent },
          { path: 'working-onsite', component: WorkingOnsiteRequestListComponent },
          { path: 'work-from-home', component: WorkFormHomeRequestListComponent },
          { path: 'transfer-leave-entitlements', component: TransferLeaveEntitlementsRequestListComponent },
          { path: '', redirectTo: 'leave', pathMatch: 'full' },
        ],
      },
    ],
  },
];
const TABS: MenuItem[] = [
  { title: 'myTime.myLeave', route: '/my-time/my-leave', permissions: [] },
  { title: 'myTime.workingHours', route: '/my-time/working-hours', permissions: [] },
  { title: 'myTime.myRequest', route: '/my-time/my-requests', permissions: [] },
  {
    title: 'requestManagement',
    route: '/my-time/requests',
    permissions: ['VIEW_REQUEST_MANAGEMENT', 'VIEW_SUBORDINATE_REQUEST'],
  },
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
    FormlyAssigneeComponentModule,
    FormlyMentionEditorComponentModule,
  ],
  providers: [
    TranslocoDatePipe,
    MyRequestsService,
    RequestDetailDialogService,
    { provide: HEADER_TABS, useValue: TABS },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'myTime', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class MyTimeModule {}
