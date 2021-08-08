import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetFileModule } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiAvatarModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiLazyLoadingModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { EmployeeRequestDetailDialogComponent } from './components/employee-request-detail-dialog/employee-request-detail-dialog.component';
import { RejectRequestDialogComponent } from './components/reject-leave-request-dialog/reject-request-dialog.component';
import { RequestManagementFilterComponent } from './components/request-management-filter/request-management-filter.component';
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
    RequestManagementFilterComponent,
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
    TuiInputNumberModule,
    TuiDataListModule,
    TuiInputModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
    FormsModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiLazyLoadingModule,
    TuiAccordionModule,
    GetFileModule,
    TuiAvatarModule,
  ],
})
export class RequestManagementModule {}
