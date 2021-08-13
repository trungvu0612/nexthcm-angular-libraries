import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
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
import { RequestOtComponent } from './components/request-ot/request-ot.component';
import { RequestWorkOnsiteComponent } from './components/request-work-onsite/request-work-onsite.component';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { MyRequestsComponent } from './my-requests.component';
import { ListOtRequestComponent } from './pages/list-ot-request/list-ot-request.component';
import { ListTimesheetUpdateComponent } from './pages/list-timesheet-update/list-timesheet-update.component';
import { ListWorkFromHomeComponent } from './pages/list-work-from-home/list-work-from-home.component';
import { MyWorkingOutsideRequestsComponent } from './pages/list-working-outside/my-working-outside-requests.component';

@NgModule({
  declarations: [
    ListOtRequestComponent,
    ListTimesheetUpdateComponent,
    MyWorkingOutsideRequestsComponent,
    RequestsDialogComponent,
    RequestOtComponent,
    ListWorkFromHomeComponent,
    RequestWorkOnsiteComponent,
    MyRequestsComponent,
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
  ],
})
export class MyRequestsModule {}
