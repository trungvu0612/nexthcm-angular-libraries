import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiColorModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiInputMonthModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { MyRequestsModule } from '../my-request/my-requests.module';
import { LeaveManagementDetailDialogComponent } from './leave-management-detail-dialog/leave-management-detail-dialog.component';
import { ListRequestManagementComponent } from './list-request-management/list-request-management.component';
import { LeaveRequestComponent } from './list-table/leave-request/leave-request.component';
import { OvertimeComponent } from './list-table/overtime/overtime.component';
import { UpdateTimeComponent } from './list-table/update-time/update-time.component';
import { WorkingOutsideComponent } from './list-table/working-outside/working-outside.component';
import { RequestManagementComponent } from './request-management.component';

@NgModule({
  declarations: [
    RequestManagementComponent,
    ListRequestManagementComponent,
    OvertimeComponent,
    LeaveRequestComponent,
    UpdateTimeComponent,
    WorkingOutsideComponent,
    LeaveManagementDetailDialogComponent
  ],
  imports: [
    MyRequestsModule,
    CommonModule,
    RouterModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiRadioBlockModule,
    TuiMarkerIconModule,
    TuiFieldErrorModule,
    TuiMarkerIconModule,
    TuiTagModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiGroupModule,
    TuiTabsModule,
    TuiDialogModule,
    ReactiveFormsModule,
    TuiColorModule,
    TuiSvgModule,
    TuiInputMonthModule,
    TuiAvatarModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TranslocoModule
  ],
})
export class RequestManagementModule {}
