import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiReorderModule, TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiFilterModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiInputMonthModule,
  TuiTabsModule,
  TuiTagModule
} from '@taiga-ui/kit';
import { LeaveDetailDialogComponent } from './components/leave-detail-dialog/leave-detail-dialog.component';
import { RequestDataTableComponent } from './components/request-data-table/request-data-table.component';
import { RequestDialogComponent } from './components/request-dialog/request-dialog.component';
import { SubmitLeaveRequestDialogComponent } from './components/submit-leave-request-dialog/submit-leave-request-dialog.component';
import { TimeDataTableComponent } from './components/time-data-table/time-data-table.component';
import { MyTimeRoutingModule } from './my-time-routing.module';
import { MyTimeComponent } from './my-time.component';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';

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
  ],
  imports: [
    CommonModule,
    MyTimeRoutingModule,
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
    FormlyTaigaUiModule,
    TuiFilterModule,
  ],
})
export class MyTimeModule {}
