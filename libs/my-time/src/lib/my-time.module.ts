import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutModule, LayoutModule } from '@nexthcm/ui';
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
import { LeaveDetailDialogComponent } from './components/leave-detail-dialog/leave-detail-dialog.component';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { RequestDialogComponent } from './components/request-dialog/request-dialog.component';
import { RequestOtComponent } from './components/request-ot/request-ot.component';
import { SubmitLeaveRequestDialogComponent } from './components/submit-leave-request-dialog/submit-leave-request-dialog.component';
import { TimeDataTableComponent } from './components/time-data-table/time-data-table.component';
import { WorkingOutsiteComponent } from './components/working-outsite/working-outsite.component';
import { LeaveTypeModule } from './modules/leave-type/leave-type.module';
import { MyRequestsModule } from './modules/my-request/my-requests.module';
import { MyTimeRoutingModule } from './my-time-routing.module';
import { MyTimeComponent } from './my-time.component';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';
import { WorkingHourComponent } from './pages/working-hour/working-hour.component';

@NgModule({
  declarations: [
    MyTimeComponent,
    TimeDataTableComponent,
    MyLeaveComponent,
    MyRequestComponent,
    RequestDataTableComponent,
    RequestDialogComponent,
    LeaveDetailDialogComponent,
    SubmitLeaveRequestDialogComponent,
    RequestOtComponent,
    WorkingOutsiteComponent,
    WorkingHourComponent,
  ],
  imports: [
    CommonModule,
    MyTimeRoutingModule,
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
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiTextAreaModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    LayoutModule,
    AdminLayoutModule,
    TuiDataListModule,
  ],
})
export class MyTimeModule {}
