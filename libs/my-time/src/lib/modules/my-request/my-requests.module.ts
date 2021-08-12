import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetFileModule } from '@nexthcm/cdk';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiColorModule,
  TuiDialogModule,
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
import { MyRequestManagementFilterComponent } from './components/my-request-management-filter/my-request-management-filter.component';
import { ListMyRequestComponent } from './list-my-request/list-my-request.component';
import { ListOtRequestComponent } from './list-ot-request/list-ot-request.component';
import { ListTimesheetUpdateComponent } from './list-timesheet-update/list-timesheet-update.component';
import { ListWorkFromHomeComponent } from './list-work-from-home/list-work-from-home.component';
import { MyWorkingOutsideRequestsComponent } from './list-working-outside/my-working-outside-requests.component';
import { MyRequestsComponent } from './my-requests.component';
import { RequestDetailsWfhComponent } from './request-details-wfh/request-details-wfh.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestOtComponent } from './request-ot/request-ot.component';
import { RequestWorkOnsiteComponent } from './request-work-onsite/request-work-onsite.component';

@NgModule({
  declarations: [
    MyRequestsComponent,
    ListMyRequestComponent,
    ListOtRequestComponent,
    ListTimesheetUpdateComponent,
    MyWorkingOutsideRequestsComponent,
    RequestDetailsComponent,
    RequestOtComponent,
    ListWorkFromHomeComponent,
    RequestDetailsWfhComponent,
    MyRequestManagementFilterComponent,
    RequestWorkOnsiteComponent,
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
    FormlyTaigaUiModule,
    TuiGroupModule,
    TuiTabsModule,
    TuiDialogModule,
    ReactiveFormsModule,
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
    GetFileModule,
    TuiAvatarModule,
    TranslocoLocaleModule,
  ],
})
export class MyRequestsModule {}
