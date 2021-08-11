import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputMonthModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { CancelDialogLeaveComponent } from './cancel-dialog-leave/cancel-dialog-leave.component';
import { DurationConfirmDialogComponent } from './duaration-comfirm-dialog/duration-confirm-dialog.component';
import { HistoryRequestComponent } from './history-request/history-request.component';
import { LeaveDetailComponent } from './leave-detail/leave-detail.component';
import { LeaveRequestManagementComponent } from './leave-request-management/leave-request-management.component';
import { MyLeaveComponent } from './my-leave.component';
import { NotedComponent } from './noted/noted.component';
import { SubmitLeaveRequestDialogComponent } from './submit-leave-request-dialog/submit-leave-request-dialog.component';

@NgModule({
  declarations: [
    MyLeaveComponent,
    CancelDialogLeaveComponent,
    DurationConfirmDialogComponent,
    LeaveDetailComponent,
    LeaveRequestManagementComponent,
    SubmitLeaveRequestDialogComponent,
    NotedComponent,
    HistoryRequestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule,
    TranslocoModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiLinkModule,
    TuiSvgModule,
    TuiDataListModule,
    TuiTabsModule,
    TuiAvatarModule,
    TuiTablePaginationModule,
    TuiTagModule,
    TuiTableModule,
    TuiInputMonthModule,
    TuiLetModule,
    TuiLoaderModule,
    TableModule,
  ],
})
export class MyLeaveModule {}
