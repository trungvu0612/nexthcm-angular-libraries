import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { LayoutModule, WorkflowActionsButtonDropdownComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiColorModule,
  TuiGroupModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiAvatarModule,
  TuiFieldErrorModule,
  TuiLazyLoadingModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';

import { RequestFiltersComponentModule } from '../../internal/components';
import { TransferLeaveEntitlementTypePipeModule } from '../../internal/pipes';
import { CreateRequestFormsModule } from '../../shared/create-request-forms/create-request-forms.module';
import { RequestCommentComponentModule } from '../../shared/request-comment/request-comment.component';
import { MyRequestsComponent } from './my-requests.component';
import { MyTransferLeaveEntitlementsRequestsComponent } from './pages/my-transfer-leave-entitlements-requests/my-transfer-leave-entitlements-requests.component';
import { MyUpdateTimesheetRequestsComponent } from './pages/my-update-timesheet-requests/my-update-timesheet-requests.component';
import { MyWorkFromHomeRequestsComponent } from './pages/my-work-from-home-requests/my-work-from-home-requests.component';
import { MyWorkingAfterHoursRequestsComponent } from './pages/my-working-after-hours-requests/my-working-after-hours-requests.component';
import { MyWorkingOnsiteRequestsComponent } from './pages/my-working-onsite-requests/my-working-onsite-requests.component';

@NgModule({
  declarations: [
    MyWorkingAfterHoursRequestsComponent,
    MyUpdateTimesheetRequestsComponent,
    MyWorkingOnsiteRequestsComponent,
    MyWorkFromHomeRequestsComponent,
    MyRequestsComponent,
    MyTransferLeaveEntitlementsRequestsComponent,
  ],
  imports: [
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
    TuiGroupModule,
    TuiTabsModule,
    TuiColorModule,
    TuiSvgModule,
    TranslocoModule,
    TuiLoaderModule,
    TableModule,
    TuiLetModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiLazyLoadingModule,
    TuiAccordionModule,
    GetFilePipeModule,
    TuiAvatarModule,
    TranslocoLocaleModule,
    LayoutModule,
    WorkflowActionsButtonDropdownComponentModule,
    TransferLeaveEntitlementTypePipeModule,
    PushModule,
    RequestFiltersComponentModule,
    CreateRequestFormsModule,
    RequestCommentComponentModule,
  ],
})
export class MyRequestsModule {}
