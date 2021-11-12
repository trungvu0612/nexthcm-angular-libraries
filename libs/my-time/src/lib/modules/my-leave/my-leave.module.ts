import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule, WorkflowActionsButtonDropdownComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { RequestFiltersComponentModule } from '../../internal/components/request-filters/request-filters.component';
import { MyLeaveService } from '../../services';
import { LeaveRequestDateRangeComponentModule } from '../../shared/leave-request-date-range/leave-request-date-range.component';
import { RequestListFilterComponentModule } from '../../shared/request-list-filters/request-list-filters.component';
import { MyLeaveComponent } from './my-leave.component';

@NgModule({
  declarations: [MyLeaveComponent],
  imports: [
    CommonModule,
    LayoutModule,
    TranslocoModule,
    TuiButtonModule,
    RequestListFilterComponentModule,
    TuiLoaderModule,
    TableModule,
    TuiLetModule,
    LeaveRequestDateRangeComponentModule,
    TuiTagModule,
    WorkflowActionsButtonDropdownComponentModule,
    TuiTablePaginationModule,
    TranslocoLocaleModule,
    LeaveRequestDateRangeComponentModule,
    RequestFiltersComponentModule,
    PushModule,
  ],
  providers: [MyLeaveService],
})
export class MyLeaveModule {}
