import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseFormComponentModule, LayoutModule, WorkflowActionsButtonDropdownComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TableModule } from 'ngx-easy-table';
import { MyLeaveService } from '../../services';
import { LeaveRequestDateRangeComponentModule } from '../shared/leave-request-date-range/leave-request-date-range.component';
import { RequestListFilterComponentModule } from '../shared/request-list-filter/request-list-filter.component';
import { CreateLeaveRequestDialogComponent } from './components/create-leave-request-dialog/create-leave-request-dialog.component';
import { DurationConfirmDialogComponent } from './components/duaration-comfirm-dialog/duration-confirm-dialog.component';
import { SubmitLeaveRequestDialogComponent } from './components/submit-leave-request-dialog/submit-leave-request-dialog.component';
import { MyLeaveComponent } from './my-leave.component';

@NgModule({
  declarations: [
    MyLeaveComponent,
    DurationConfirmDialogComponent,
    SubmitLeaveRequestDialogComponent,
    CreateLeaveRequestDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    TranslocoModule,
    TuiButtonModule,
    TuiTablePaginationModule,
    TuiTagModule,
    TuiLetModule,
    TuiLoaderModule,
    TableModule,
    TranslocoLocaleModule,
    LeaveRequestDateRangeComponentModule,
    RequestListFilterComponentModule,
    BaseFormComponentModule,
    PolymorpheusModule,
    WorkflowActionsButtonDropdownComponentModule,
  ],
  providers: [MyLeaveService],
})
export class MyLeaveModule {}
