import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { UpsertJobLevelDialogComponent } from '../../components/upsert-job-level-dialog/upsert-job-level-dialog.component';
import { JobLevel } from '../../models/job-level';
import { AdminJobLevelsService } from '../../services/admin-job-levels.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-job-level-management',
  templateUrl: './job-level-management.component.html',
  styleUrls: ['./job-level-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobLevelManagementComponent extends AbstractServerSortPaginationTableComponent<JobLevel> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_LEVEL_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminJobLevelsService.getJobLevels(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<JobLevel>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly adminJobLevelsService: AdminJobLevelsService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
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
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
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
      .subscribe(
        this.promptService.handleResponse('jobLevels.deleteJobLevelSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
