import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiSelectModule,
  TuiTextAreaModule,
  TuiUnfinishedValidatorModule,
} from '@taiga-ui/kit';
import { RequestOtComponent } from './request-ot/request-ot.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHourDetailComponent } from './working-hour-detail/working-hour-detail.component';
import { WorkingHourComponent } from './working-hour.component';
import { WorkingOutsiteComponent } from './working-outsite/working-outsite.component';

@NgModule({
  declarations: [
    WorkingHourComponent,
    RequestOtComponent,
    RequestUpdateTimeComponent,
    WorkingHourDetailComponent,
    WorkingOutsiteComponent,
  ],
  imports: [
    CommonModule,
    TuiInputDateModule,
    ReactiveFormsModule,
    TuiUnfinishedValidatorModule,
    TuiHostedDropdownModule,
    TuiLinkModule,
    TuiSvgModule,
    TuiDataListModule,
    TuiTextAreaModule,
    TuiTextfieldControllerModule,
    FormlyModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTableModule,
    TuiTablePaginationModule,
  ],
})
export class WorkingHourModule {}
