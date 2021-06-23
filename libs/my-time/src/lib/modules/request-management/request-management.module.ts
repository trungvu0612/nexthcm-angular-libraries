import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiColorModule, TuiDialogModule, TuiGroupModule } from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiTabsModule,
  TuiTagModule
} from '@taiga-ui/kit';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { ListRequestManagementComponent } from './pages/list-request-management/list-request-management.component';
import { MyRequestsModule } from '../my-request/my-requests.module';
import { RequestManagementComponent } from './request-management.component';


@NgModule({
  declarations: [
    RequestManagementComponent,
    ListRequestManagementComponent
  ],
  imports: [
    MyRequestsModule,
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
    TuiColorModule
  ]
})
export class RequestManagementModule {
}
