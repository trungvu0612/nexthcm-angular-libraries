import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiDialogModule, TuiErrorModule, TuiGroupModule } from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiTagModule,
  TuiTextAreaModule
} from '@taiga-ui/kit';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';
import { MyRequestsComponent } from './my-requests.component';
import { ListMyRequestComponent } from './pages/list-my-request/list-my-request.component';

@NgModule({
  declarations: [MyRequestsComponent, ListMyRequestComponent, RequestsDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiRadioBlockModule,
    TuiFieldErrorModule,
    TuiMarkerIconModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiGroupModule,
    TuiDialogModule,
    ReactiveFormsModule
  ]
})
export class MyRequestsModule {
}
