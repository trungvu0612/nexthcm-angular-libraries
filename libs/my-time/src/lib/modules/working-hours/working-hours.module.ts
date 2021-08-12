import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyRouteConnectorDirectiveModule } from '@nexthcm/cdk';
import { InputFilterComponentModule, SelectFilterComponentModule, SelectMonthFilterComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiTabsModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { EveryoneWorkingHoursListComponent } from './components/everyone-working-hours-list/everyone-working-hours-list.component';
import { GroupWorkingHoursTableComponent } from './components/group-working-hours-table/group-working-hours-table.component';
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
    GroupWorkingHoursTableComponent,
  ],
  imports: [
    CommonModule,
    TuiDataListModule,
    ReactiveFormsModule,
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
  ],
})
export class WorkingHoursModule {}
