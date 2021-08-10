import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTextAreaModule,
  TuiUnfinishedValidatorModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { SecondsToHourMinutePipeModule } from '../../pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe';
import { WorkingHoursDetailDialogComponent } from './components/working-hour-detail-dialog/working-hours-detail-dialog.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHoursComponent } from './working-hours.component';

@NgModule({
  declarations: [
    WorkingHoursComponent,
    RequestUpdateTimeComponent,
    WorkingHoursDetailDialogComponent,
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
    TableModule,
    TuiButtonModule,
    SecondsToHourMinutePipeModule,
    FormsModule,
    TuiInputNumberModule,
    TuiInputModule,
    TuiLetModule,
    TranslocoModule,
    TranslocoLocaleModule,
  ],
})
export class WorkingHoursModule {}
