import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { UpsertEmailTemplateDialogComponent } from '../../components/upsert-email-template-dialog/upsert-email-template-dialog.component';
import { EmailTemplate } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-email-template-management',
  templateUrl: './email-template-management.component.html',
  styleUrls: ['./email-template-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class EmailTemplateManagementComponent extends AbstractServerSortPaginationTableComponent<EmailTemplate> {
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_WORKFLOW_TABLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminWorkflowService.getEmailTemplates(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<EmailTemplate>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly adminWorkflowService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertEmailTemplate(data?: EmailTemplate): void {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertEmailTemplateDialogComponent, this.injector), {
        label: this.translocoService.translate(
          `${this.translocoScope.scope}.${data ? 'editEmailTemplate' : 'createEmailTemplate'}`
        ),
        data,
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.promptService.open({
          icon: 'success',
          html: this.translocoService.translate(
            `${this.translocoScope.scope}.${data ? 'editEmailTemplateSuccessfully' : 'createEmailTemplateSuccessfully'}`
          ),
        });
        this.fetch$.next();
      });
  }

  onRemoveEmailTemplate(id: string): void {
    this.adminWorkflowService
      .deleteEmailTemplate(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeEmailTemplateSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
