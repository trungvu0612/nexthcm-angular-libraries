import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of, share } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { UpsertJobLevelDialogComponent } from '../../components/upsert-job-level-dialog/upsert-job-level-dialog.component';
import { JobLevel } from '../../models/job-level';
import { AdminJobLevelsService } from '../../services/admin-job-levels.service';

@Component({
  selector: 'hcm-job-level-management',
  templateUrl: './job-level-management.component.html',
  styleUrls: ['./job-level-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobLevelManagementComponent extends AbstractServerSortPaginationTableComponent<JobLevel> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_LEVEL_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminJobLevelsService.getJobLevels(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<JobLevel>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly adminJobLevelsService: AdminJobLevelsService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertJobLevel(data?: JobLevel): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertJobLevelDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'jobLevels.editJobLevel' : 'jobLevels.createJobLevel'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveJobTitle(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('jobLevels.deleteJobLevel'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminJobLevelsService.deleteJobLevel(id), EMPTY)),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse('jobLevels.deleteJobLevelSuccessfully', () => this.fetch$.next()));
  }
}
