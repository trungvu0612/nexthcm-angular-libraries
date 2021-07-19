import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent, LayoutModule, PromptComponentModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiReorderModule, TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiFilterModule,
  TuiInputCountModule,
  TuiInputDateModule,
  TuiInputDateRangeModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputMonthModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { RequestDialogComponent } from './components/request-dialog/request-dialog.component';
import { RequestOtComponent } from './components/request-ot/request-ot.component';
import { RequestUpdateTimeComponent } from './components/request-update-time/request-update-time.component';
import { WorkingHourDetailComponent } from './components/working-hour-detail/working-hour-detail.component';
import { WorkingOutsiteComponent } from './components/working-outsite/working-outsite.component';
import { LeaveTypeComponent } from './modules/leave-type/leave-type.component';
import { LeaveTypeModule } from './modules/leave-type/leave-type.module';
import { ListLeaveTypeComponent } from './modules/leave-type/pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './modules/leave-type/pages/upsert-leave-type/upsert-leave-type.component';
import { MyRequestsComponent } from './modules/my-request/my-requests.component';
import { MyRequestsModule } from './modules/my-request/my-requests.module';
import { ListMyRequestComponent } from './modules/my-request/pages/list-my-request/list-my-request.component';
import { ListRequestManagementComponent } from './modules/request-management/pages/list-request-management/list-request-management.component';
import { RequestManagementComponent } from './modules/request-management/request-management.component';
import { RequestManagementModule } from './modules/request-management/request-management.module';
import { MyTimeComponent } from './my-time.component';
import { CancelDialogLeaveComponent } from './pages/my-leave/cancel-dialog-leave/cancel-dialog-leave.component';
import { DurationConfirmDialogComponent } from './pages/my-leave/duaration-comfirm-dialog/duration-confirm-dialog.component';
import { LeaveDetailDialogComponent } from './pages/my-leave/leave-detail-dialog/leave-detail-dialog.component';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';
import { SubmitLeaveRequestDialogComponent } from './pages/my-leave/submit-leave-request-dialog/submit-leave-request-dialog.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';
import { WorkingHourComponent } from './pages/working-hour/working-hour.component';
import { MyLeaveService } from './services/my-leave/my-leave.service';

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
            ],
          },
          {
            path: 'request-management',
            component: RequestManagementComponent,
            children: [
              { path: '', component: ListRequestManagementComponent },
              // { path: 'add', component: UpsertLeaveTypeComponent },
              // { path: 'edit/:id', component: UpsertLeaveTypeComponent }
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
  declarations: [
    MyTimeComponent,
    MyLeaveComponent,
    MyRequestComponent,
    RequestDataTableComponent,
    RequestDialogComponent,
    LeaveDetailDialogComponent,
    SubmitLeaveRequestDialogComponent,
    RequestOtComponent,
    WorkingOutsiteComponent,
    WorkingHourComponent,
    CancelDialogLeaveComponent,
    DurationConfirmDialogComponent,
    RequestUpdateTimeComponent,
    WorkingHourDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(myTimeRoutes),
    RequestManagementModule,
    LeaveTypeModule,
    MyRequestsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiInputCountModule,
    ReactiveFormsModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiLoaderModule,
    TuiReorderModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiTabsModule,
    TuiInputMonthModule,
    TuiTagModule,
    TuiSvgModule,
    FormlyModule,
    TuiFilterModule,
    TuiInputDateModule,
    TuiInputDateRangeModule,
    TuiInputDateTimeModule,
    TuiTextAreaModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    LayoutModule,
    TuiDataListModule,
    PromptComponentModule
  ],
  providers: [MyLeaveService],
})
export class MyTimeModule {}
