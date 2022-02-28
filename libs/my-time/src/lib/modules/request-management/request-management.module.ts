import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule, WorkflowActionsButtonDropdownComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsModule } from 'ngx-permissions';

import { RequestFiltersComponentModule } from '../../internal/components';
import { TransferLeaveEntitlementTypePipeModule } from '../../internal/pipes';
import { LeaveRequestDateRangeComponentModule } from '../../shared';
import { CreateRequestFormsModule } from '../../shared/create-request-forms/create-request-forms.module';
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
    TranslocoLocaleModule,
    LeaveRequestDateRangeComponentModule,
    WorkflowActionsButtonDropdownComponentModule,
    NgxPermissionsModule,
    TransferLeaveEntitlementTypePipeModule,
    RequestFiltersComponentModule,
    PushModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiSvgModule,
    TuiDataListModule,
    CreateRequestFormsModule,
  ],
})
export class RequestManagementModule {}
