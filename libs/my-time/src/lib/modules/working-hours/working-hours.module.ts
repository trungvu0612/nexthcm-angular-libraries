import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import {
  BaseFormComponentModule,
  BasicFilterComponentModule,
  FormlyUserComboBoxComponentModule,
  InputFilterComponentModule,
  InputNumberFilterComponentModule,
  LayoutModule,
  SelectFilterComponentModule,
  SelectMonthFilterComponentModule,
} from '@nexthcm/ui';
import { NgStackFormsModule } from '@ng-stack/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiIslandModule, TuiTabsModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsModule } from 'ngx-permissions';
import { WorkingHoursService } from '../../internal/services';
import { MyTimeService } from '../../services';
import { CreateUpdateTimesheetRequestDialogComponent } from './components/create-update-timesheet-request-dialog/create-update-timesheet-request-dialog.component';
import { EveryoneWorkingHoursListComponent } from './components/everyone-working-hours-list/everyone-working-hours-list.component';
import { ExportTimeLogDialogComponent } from './components/export-time-log-dialog/export-time-log-dialog.component';
import { GroupWorkingHoursTableComponent } from './components/group-working-hours-table/group-working-hours-table.component';
import { OnlyMeWorkingHoursListComponent } from './components/only-me-working-hours-list/only-me-working-hours-list.component';
import { WorkingHoursDetailDialogComponent } from './components/working-hour-detail-dialog/working-hours-detail-dialog.component';
import { WorkingHoursFiltersComponent } from './components/working-hours-filters/working-hours-filters.component';
import { WorkingHoursComponent } from './working-hours.component';

@NgModule({
  declarations: [
    WorkingHoursDetailDialogComponent,
    WorkingHoursComponent,
    OnlyMeWorkingHoursListComponent,
    EveryoneWorkingHoursListComponent,
    WorkingHoursFiltersComponent,
    GroupWorkingHoursTableComponent,
    CreateUpdateTimesheetRequestDialogComponent,
    ExportTimeLogDialogComponent,
  ],
  imports: [
    CommonModule,
    TuiDataListModule,
    NgStackFormsModule,
    TuiSvgModule,
    FormlyModule,
    TuiDataListWrapperModule,
    TuiTablePaginationModule,
    TableModule,
    TuiButtonModule,
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
    BaseFormComponentModule,
    TuiIslandModule,
    FormlyUserComboBoxComponentModule,
    LayoutModule,
    NgxPermissionsModule,
    BasicFilterComponentModule,
    PushModule,
    InputNumberFilterComponentModule,
  ],
  providers: [WorkingHoursService, MyTimeService],
})
export class WorkingHoursModule {}
