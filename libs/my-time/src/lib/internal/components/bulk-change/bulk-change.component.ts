import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiButtonModule, TuiDialogContext, TuiGroupModule } from '@taiga-ui/core';
import { TuiRadioBlockModule, TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Columns, DefaultConfig, TableModule } from 'ngx-easy-table';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { StatusTransition } from '../../models';
import { MyRequestsService } from '../../services';

interface ContextData {
  data: StatusTransition[];
  columns$: Observable<Columns[]>;
  template: TemplateRef<unknown>;
}

@Component({
  selector: 'hcm-bulk-change',
  templateUrl: './bulk-change.component.html',
  styleUrls: ['./bulk-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkChangeComponent {
  readonly statusControl = new FormControl(0);
  readonly configuration = {
    ...DefaultConfig,
    paginationEnabled: false,
    orderEnabled: false,
    fixedColumnWidth: false,
    rows: Math.max(...this.context.data.data.map(({ requests: { length } }) => length)),
  };
  readonly columns$ = this.context.data.columns$.pipe(map((columns) => columns.slice(0, -1)));

  readonly submit$ = new Subject<void>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap(() =>
      this.myRequestsService
        .bulkChange(
          this.data.requests.map(({ id }) => ({
            id,
            request: { nextState: this.data.targetStatus.id },
          }))
        )
        .pipe(
          tap(this.promptService.handleResponse('updateSuccessfully', () => this.context.completeWith())),
          startWith(false)
        )
    ),
    catchError(() => of(true)),
    map((v) => !v)
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<void, ContextData>,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly myRequestsService: MyRequestsService,
    private readonly promptService: PromptService
  ) {}

  get data(): StatusTransition {
    return this.context.data.data[this.statusControl.value];
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
  ],
  exports: [BulkChangeComponent],
})
export class BulkChangeComponentModule {}
