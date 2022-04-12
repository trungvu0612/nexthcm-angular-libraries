import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogContext, TuiGroupModule } from '@taiga-ui/core';
import { TuiRadioBlockModule, TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Columns, DefaultConfig, TableModule } from 'ngx-easy-table';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { StatusTransition, WorkflowStatusTransition } from '../../models';
import { MyRequestsService } from '../../services';

interface ContextData {
  data: WorkflowStatusTransition[];
  columns$: Observable<Columns[]>;
  template: TemplateRef<unknown>;
  size: number;
}

@Component({
  selector: 'hcm-bulk-change',
  templateUrl: './bulk-change.component.html',
  styleUrls: ['./bulk-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkChangeComponent {
  readonly statusControl = new FormControl('0,0');
  readonly configuration = {
    ...DefaultConfig,
    paginationEnabled: false,
    orderEnabled: false,
    fixedColumnWidth: false,
    rows: this.context.data.size,
  };
  readonly columns$ = this.context.data.columns$.pipe(map((columns) => columns.slice(0, -1)));

  readonly submit$ = new Subject<void>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap(() => {
      const { requests, targetStatus } = this.currentData;

      return this.myRequestsService
        .bulkChange(requests.map(({ id }) => ({ id, request: { nextState: targetStatus.id } })))
        .pipe(
          tap(this.promptService.handleResponse('updateSuccessfully', () => this.context.completeWith())),
          startWith(false)
        );
    }),
    catchError(() => of(true)),
    map((v) => !v)
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<void, ContextData>,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly myRequestsService: MyRequestsService,
    private readonly promptService: PromptService
  ) {}

  get currentWorkflowIndex(): number {
    return +this.statusControl.value.split(',')[0];
  }

  get currentData(): StatusTransition {
    const [workflowIndex, statusIndex] = this.statusControl.value.split(',').map((status: string) => +status);
    return this.context.data.data[workflowIndex].data[statusIndex];
  }

  @tuiPure
  getWorkflowName(name: string | string[]): string {
    return typeof name === 'string' ? '' : name.join(', ');
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [BulkChangeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseFormComponentModule,
    PushModule,
    TuiButtonModule,
    TuiRadioBlockModule,
    TuiTagModule,
    TuiGroupModule,
    TableModule,
    TranslocoModule,
  ],
})
export class BulkChangeComponentModule {}
