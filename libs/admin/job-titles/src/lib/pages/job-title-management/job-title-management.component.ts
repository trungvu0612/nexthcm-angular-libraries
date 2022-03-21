import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import {
  AbstractServerSortPaginationTableComponent,
  CommonStatus,
  JobTitle,
  JobTitlesService,
  Pagination,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { UpsertJobTitleDialogComponent } from '../../components/upsert-job-title-dialog/upsert-job-title-dialog.component';
import { AdminJobTitlesService } from '../../services/admin-job-titles.service';

@Component({
  selector: 'hcm-job-title-management',
  templateUrl: './job-title-management.component.html',
  styleUrls: ['./job-title-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitleManagementComponent extends AbstractServerSortPaginationTableComponent<JobTitle> {
  readonly CommonStatus = CommonStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_TITLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'state', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly search$ = new Subject<string | null>();

  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.jobTitlesService.getJobTitles(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<JobTitle>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly jobTitlesService: JobTitlesService,
    private readonly adminJobTitlesService: AdminJobTitlesService,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchQuery) => {
          this.resetPage();
          if (searchQuery) {
            this.queryParams = this.queryParams.set('search', searchQuery);
          } else {
            this.setQueryParams('search', null);
            this.queryParams = this.queryParams.delete('search');
          }
          this.fetch$.next();
        })
      )
    );
  }

  onUpsertJobLevel(data?: JobTitle): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertJobTitleDialogComponent, this.injector), {
        label: this.translocoService.translate(
          `${this.translocoScope.scope}.${data ? 'editJobTitle' : 'createJobTitle'}`
        ),
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
        html: this.translocoService.translate(`${this.translocoScope.scope}.deleteJobTitle`),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminJobTitlesService.deleteJobTitle(id), EMPTY)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.deleteJobTitleSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
