import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiDialogModule, TuiGroupModule } from '@taiga-ui/core';
import { TuiFieldErrorModule, TuiMarkerIconModule, TuiRadioBlockModule, TuiTabsModule } from '@taiga-ui/kit';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { MyRequestsComponent } from './my-requests.component';
import { ListMyRequestComponent } from './pages/list-my-request/list-my-request.component';
import { ListOtRequestComponent } from './pages/list-ot-request/list-ot-request.component';
import { ListTimesheetUpdateComponent } from './pages/list-timesheet-update/list-timesheet-update.component';
import { ListWorkingOutsideComponent } from './pages/list-working-outside/list-working-outside.component';

@NgModule({
  declarations: [
    MyRequestsComponent,
    ListMyRequestComponent,
    RequestsDialogComponent,
    ListOtRequestComponent,
    ListTimesheetUpdateComponent,
    ListWorkingOutsideComponent,
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
    FormlyModule,
    FormlyTaigaUiModule,
    TuiGroupModule,
    TuiTabsModule,
    TuiDialogModule,
    ReactiveFormsModule,
  ],
})
export class MyRequestsModule {}
