import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiColorModule, TuiDialogModule, TuiGroupModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiFieldErrorModule,
  TuiInputMonthModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { MyRequestsModule } from '../my-request/my-requests.module';
import { ListRequestManagementComponent } from './pages/list-request-management/list-request-management.component';
import { LeaveManagementDetailDialogComponent } from './pages/tab/diaglog/leave-management-detail-dialog/leave-management-detail-dialog.component';
import { HistoryRequestComponent } from './pages/tab/diaglog/tab/history-request/history-request.component';
import { NotedComponent } from './pages/tab/diaglog/tab/noted/noted.component';
import { LeaveRequestComponent } from './pages/tab/list-table/leave-request/leave-request.component';
import { OvertimeComponent } from './pages/tab/list-table/overtime/overtime.component';
import { UpdateTimeComponent } from './pages/tab/list-table/update-time/update-time.component';
import { WorkingOutsideComponent } from './pages/tab/list-table/working-outside/working-outside.component';
import { RequestManagementComponent } from './request-management.component';

@NgModule({
  declarations: [
    RequestManagementComponent,
    ListRequestManagementComponent,
    OvertimeComponent,
    LeaveRequestComponent,
    UpdateTimeComponent,
    WorkingOutsideComponent,
    LeaveManagementDetailDialogComponent,
    NotedComponent,
    HistoryRequestComponent,
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
  ],
})
export class RequestManagementModule {}
