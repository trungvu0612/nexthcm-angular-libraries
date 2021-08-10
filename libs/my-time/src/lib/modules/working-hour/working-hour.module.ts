import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
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
import { RequestOtComponent } from './request-ot/request-ot.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHourDetailComponent } from './working-hour-detail/working-hour-detail.component';
import { WorkingHourComponent } from './working-hour.component';
import { WorkingOutsiteComponent } from './working-outsite/working-outsite.component';
import { TableModule } from 'ngx-easy-table';
import { SecondsToHourMinutePipeModule } from '../../pipes/seconds-to-hour-mintue/seconds-to-hour-minute.pipe';
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoRootModule } from 'libs/core/src/lib/transloco/transloco-root.module';

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
    TableModule,
    TuiButtonModule,
    SecondsToHourMinutePipeModule,
    FormsModule,
    TuiInputNumberModule,
    TuiInputModule,
    TuiLetModule,
    TranslocoRootModule,
    TranslocoLocaleModule,
  ],
})
export class WorkingHourModule {}
