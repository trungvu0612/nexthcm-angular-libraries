import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { LeaveRequestDateRangeComponentModule } from '../shared/leave-request-date-range/leave-request-date-range.component';
import { RequestListFilterComponentModule } from '../shared/request-list-filter/request-list-filter.component';
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
    RequestListFilterComponentModule,
    TranslocoLocaleModule,
    LeaveRequestDateRangeComponentModule,
  ],
})
export class RequestManagementModule {}
