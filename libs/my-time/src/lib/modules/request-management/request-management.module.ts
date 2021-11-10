import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule, WorkflowActionsButtonDropdownComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CreateLeaveRequestDialogComponentModule } from '../../shared/create-leave-request-dialog/create-leave-request-dialog.component';
import { LeaveRequestDateRangeComponentModule } from '../../shared/leave-request-date-range/leave-request-date-range.component';
import { RequestListFilterComponentModule } from '../../shared/request-list-filters/request-list-filters.component';
import { TransferLeaveEntitlementTypePipeModule } from '../../shared/transfer-leave-entitlement-type/transfer-leave-entitlement-type.pipe';
import { LeaveRequestListComponent } from './pages/leave-request-list/leave-request-list.component';
import { TransferLeaveEntitlementsRequestListComponent } from './pages/transfer-leave-entitlements-request-list/transfer-leave-entitlements-request-list.component';
import { UpdateTimesheetRequestListComponent } from './pages/update-timesheet-request-list/update-timesheet-request-list.component';
import { WorkFormHomeRequestListComponent } from './pages/work-form-home-request-list/work-form-home-request-list.component';
import { WorkingAfterHoursRequestListComponent } from './pages/working-after-hours-request-list/working-after-hours-request-list.component';
import { WorkingOnsiteRequestListComponent } from './pages/working-onsite-request-list/working-onsite-request-list.component';
import { RequestManagementComponent } from './request-management.component';

@NgModule({
  declarations: [
    RequestManagementComponent,
    LeaveRequestListComponent,
    WorkingAfterHoursRequestListComponent,
    UpdateTimesheetRequestListComponent,
    WorkingOnsiteRequestListComponent,
    WorkFormHomeRequestListComponent,
    TransferLeaveEntitlementsRequestListComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
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
    WorkflowActionsButtonDropdownComponentModule,
    CreateLeaveRequestDialogComponentModule,
    NgxPermissionsModule,
    TransferLeaveEntitlementTypePipeModule,
  ],
})
export class RequestManagementModule {}
