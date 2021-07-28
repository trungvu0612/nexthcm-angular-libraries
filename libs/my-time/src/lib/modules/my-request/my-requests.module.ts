import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiColorModule, TuiDialogModule, TuiGroupModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { ListMyRequestComponent } from './list-my-request/list-my-request.component';
import { ListOtRequestComponent } from './list-ot-request/list-ot-request.component';
import { ListTimesheetUpdateComponent } from './list-timesheet-update/list-timesheet-update.component';
import { ListWorkFromHomeComponent } from './list-work-from-home/list-work-from-home.component';
import { ListWorkingOutsideComponent } from './list-working-outside/list-working-outside.component';
import { MyRequestsComponent } from './my-requests.component';
import { RequestDetailsWfhComponent } from './request-details-wfh/request-details-wfh.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestOtComponent } from './request-ot/request-ot.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    MyRequestsComponent,
    ListMyRequestComponent,
    ListOtRequestComponent,
    ListTimesheetUpdateComponent,
    ListWorkingOutsideComponent,
    RequestDetailsComponent,
    RequestOtComponent,
    ListWorkFromHomeComponent,
    RequestDetailsWfhComponent,
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
  ],
})
export class MyRequestsModule {}
