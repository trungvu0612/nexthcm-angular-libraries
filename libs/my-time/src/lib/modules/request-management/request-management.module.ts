import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetFileModule } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiLazyLoadingModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { SecondsToHourMinutePipeModule } from '../../pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe';
import { AbstractColDayRangeComponentModule } from '../shared/abstract-col-day-range/abstract-col-day-range.component';
import { RequestListFilterComponentModule } from '../shared/request-list-filter/request-list-filter.component';
import { EmployeeRequestDetailDialogComponent } from './components/employee-request-detail-dialog/employee-request-detail-dialog.component';
import { RejectRequestDialogComponent } from './components/reject-leave-request-dialog/reject-request-dialog.component';
import { LeaveRequestListComponent } from './pages/leave-request-list/leave-request-list.component';
import { UpdateTimesheetRequestListComponent } from './pages/update-timesheet-request-list/update-timesheet-request-list.component';
import { WorkFormHomeRequestListComponent } from './pages/work-form-home-request-list/work-form-home-request-list.component';
import { WorkingAfterHoursRequestListComponent } from './pages/working-after-hours-request-list/working-after-hours-request-list.component';
import { WorkingOutsideRequestListComponent } from './pages/working-outside-request-list/working-outside-request-list.component';
import { RequestManagementComponent } from './request-management.component';

@NgModule({
  declarations: [
    RequestManagementComponent,
    LeaveRequestListComponent,
    RejectRequestDialogComponent,
    WorkingAfterHoursRequestListComponent,
    UpdateTimesheetRequestListComponent,
    WorkingOutsideRequestListComponent,
    WorkFormHomeRequestListComponent,
    EmployeeRequestDetailDialogComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    TuiTabsModule,
    RouterModule,
    TuiLoaderModule,
    TableModule,
    TuiButtonModule,
    TuiTablePaginationModule,
    TuiTagModule,
    TuiLetModule,
    FormlyModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiLazyLoadingModule,
    TuiAccordionModule,
    GetFileModule,
    TuiAvatarModule,
    RequestListFilterComponentModule,
    TranslocoLocaleModule,
    SecondsToHourMinutePipeModule,
    AbstractColDayRangeComponentModule
  ],
})
export class RequestManagementModule {}
