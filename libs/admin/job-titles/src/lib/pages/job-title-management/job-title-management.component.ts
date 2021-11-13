import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertJobTitleDialogComponent } from '../../components/upsert-job-title-dialog/upsert-job-title-dialog.component';
import { JobTitle } from '../../models/job-title';
import { AdminJobTitlesService } from '../../services/admin-job-titles.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-job-title-management',
  templateUrl: './job-title-management.component.html',
  styleUrls: ['./job-title-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitleManagementComponent extends AbstractServerSortPaginationTableComponent<JobTitle> {
  @ViewChild('table') table!: BaseComponent;

  readonly CommonStatus = CommonStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_TITLE_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'state', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminJobTitlesService.getJobTitles(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<JobTitle>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly adminJobTitlesService: AdminJobTitlesService,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertJobLevel(data?: JobTitle): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertJobTitleDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'jobTitles.editJobTitle' : 'jobTitles.createJobTitle'),
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
        html: this.translocoService.translate('jobTitles.deleteJobTitle'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminJobTitlesService.deleteJobTitle(id), EMPTY)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('jobTitles.deleteJobTitleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
