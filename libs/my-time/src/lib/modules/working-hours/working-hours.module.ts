import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { InputFilterComponentModule, SelectFilterComponentModule, SelectMonthFilterComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTextAreaModule,
  TuiUnfinishedValidatorModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { SecondsToHourMinutePipeModule } from '../../pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe';
import { EveryoneWorkingHoursListComponent } from './components/everyone-working-hours-list/everyone-working-hours-list.component';
import { OnlyMeWorkingHoursListComponent } from './components/only-me-working-hours-list/only-me-working-hours-list.component';
import { WorkingHoursDetailDialogComponent } from './components/working-hour-detail-dialog/working-hours-detail-dialog.component';
import { WorkingHoursFilterComponent } from './components/working-hours-filter/working-hours-filter.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHoursComponent } from './working-hours.component';

@NgModule({
  declarations: [
    RequestUpdateTimeComponent,
    WorkingHoursDetailDialogComponent,
    WorkingHoursComponent,
    OnlyMeWorkingHoursListComponent,
    EveryoneWorkingHoursListComponent,
    WorkingHoursFilterComponent,
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
    TuiTabsModule,
    TuiLoaderModule,
    PropertyRouteConnectorDirectiveModule,
    SelectMonthFilterComponentModule,
    InputFilterComponentModule,
    SelectFilterComponentModule,
    RouterModule,
  ],
})
export class WorkingHoursModule {}
