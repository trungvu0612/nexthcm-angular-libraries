import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
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
export class EmailTemplateManagementComponent extends AbstractServerPaginationTableComponent<EmailTemplate> {
  @ViewChild('table') table!: BaseComponent;

  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('ADMIN_WORKFLOW_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly CommonStatus = CommonStatus;
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminWorkflowService.getEmailTemplates(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<EmailTemplate>>,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly adminWorkflowService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertEmailTemplate(data?: EmailTemplate): void {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertEmailTemplateDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'editEmailTemplate' : 'createEmailTemplate'),
        data,
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveEmailTemplate(id: string): void {
    this.adminWorkflowService
      .deleteEmailTemplate(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        this.promptService.handleResponse('removeEmailTemplateSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
