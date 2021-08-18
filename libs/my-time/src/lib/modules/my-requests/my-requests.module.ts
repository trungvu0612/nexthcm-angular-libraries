import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { BaseFormComponentModule, FormlyTaigaUiModule } from '@nexthcm/ui';
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
import { RequestListFilterComponentModule } from '../shared/request-list-filter/request-list-filter.component';
import { SubmitOvertimeRequestDialogComponent } from './components/submit-overtime-request-dialog/submit-overtime-request-dialog.component';
import { SubmitWorkFromHomeRequestDialogComponent } from './components/submit-work-from-home-request-dialog/submit-work-from-home-request-dialog.component';
import { SubmitWorkingOutsideRequestDialogComponent } from './components/submit-working-outside-request-dialog/submit-working-outside-request-dialog.component';
import { MyRequestsComponent } from './my-requests.component';
import { MyUpdateTimesheetRequestsComponent } from './pages/my-update-timesheet-requests/my-update-timesheet-requests.component';
import { MyWorkFromHomeRequestsComponent } from './pages/my-work-from-home-requests/my-work-from-home-requests.component';
import { MyWorkingAfterHoursRequestsComponent } from './pages/my-working-after-hours-requests/my-working-after-hours-requests.component';
import { MyWorkingOutsideRequestsComponent } from './pages/my-working-outside-requests/my-working-outside-requests.component';

@NgModule({
  declarations: [
    MyWorkingAfterHoursRequestsComponent,
    MyUpdateTimesheetRequestsComponent,
    MyWorkingOutsideRequestsComponent,
    MyWorkFromHomeRequestsComponent,
    MyRequestsComponent,
    SubmitWorkFromHomeRequestDialogComponent,
    SubmitWorkingOutsideRequestDialogComponent,
    SubmitOvertimeRequestDialogComponent,
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
    GetFilePipeModule,
    TuiAvatarModule,
    TranslocoLocaleModule,
    BaseFormComponentModule,
    RequestListFilterComponentModule,
  ],
})
export class MyRequestsModule {}