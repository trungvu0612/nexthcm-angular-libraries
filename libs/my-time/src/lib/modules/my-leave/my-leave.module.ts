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

import { RequestFiltersComponentModule } from '../../internal/components';
import { MyLeaveService } from '../../internal/services';
import { LeaveRequestDateRangeComponentModule } from '../../shared';
import { RequestCommentComponentModule } from '../../shared/request-comment/request-comment.component';
import { MyLeaveComponent } from './my-leave.component';

@NgModule({
  declarations: [MyLeaveComponent],
  imports: [
    CommonModule,
    LayoutModule,
    TranslocoModule,
    TuiButtonModule,
    TuiLoaderModule,
    TableModule,
    TuiLetModule,
    TuiTagModule,
    WorkflowActionsButtonDropdownComponentModule,
    TuiTablePaginationModule,
    TranslocoLocaleModule,
    LeaveRequestDateRangeComponentModule,
    RequestFiltersComponentModule,
    PushModule,
    RequestCommentComponentModule,
  ],
  providers: [MyLeaveService],
})
export class MyLeaveModule {}
