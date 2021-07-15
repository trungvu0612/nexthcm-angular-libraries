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
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { MyRequestsComponent } from './my-requests.component';
import { ListMyRequestComponent } from './pages/list-my-request/list-my-request.component';
import { ListOtRequestComponent } from './pages/list-ot-request/list-ot-request.component';
import { ListTimesheetUpdateComponent } from './pages/list-timesheet-update/list-timesheet-update.component';
import { ListWorkingOutsideComponent } from './pages/list-working-outside/list-working-outside.component';
import { RequestOtComponent } from './components/diaglog/request-ot/request-ot.component';
import { ListWorkFromHomeComponent } from './pages/list-work-from-home/list-work-from-home.component';
import { RequestDetailsWfhComponent } from './components/request-details-wfh/request-details-wfh.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';

@NgModule({
  declarations: [
    MyRequestsComponent,
    ListMyRequestComponent,
    RequestsDialogComponent,
    ListOtRequestComponent,
    ListTimesheetUpdateComponent,
    ListWorkingOutsideComponent,
    RequestDetailsComponent,
    RequestOtComponent,
    ListWorkFromHomeComponent,
    RequestDetailsWfhComponent,
  ],
  exports: [ListTimesheetUpdateComponent, ListOtRequestComponent, ListWorkingOutsideComponent],
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
  ],
})
export class MyRequestsModule {}
