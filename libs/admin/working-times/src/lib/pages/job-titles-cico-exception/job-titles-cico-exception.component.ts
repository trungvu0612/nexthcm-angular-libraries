import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import {
  AbstractServerPaginationTableComponent,
  CommonStatus,
  JobTitle,
  JobTitlesService,
  Pagination,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
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

@Component({
  selector: 'hcm-job-titles-cico-exception',
  templateUrl: './job-titles-cico-exception.component.html',
  styleUrls: ['./job-titles-cico-exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class JobTitlesCICOExceptionComponent extends AbstractServerPaginationTableComponent<JobTitle> {
  readonly CommonStatus = CommonStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EXCLUSION_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'state', title: result.status },
        {
          key: 'isSkipCheckInOutNormal',
          title: result.excepted,
          cssClass: { name: 'text-center', includeHeader: true },
        },
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
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state);
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

  onChangeExclusion(jobTitle: JobTitle, isSkipCheckInOutNormal: boolean): void {
    const payload = { ...jobTitle, isSkipCheckInOutNormal };

    this.jobTitlesService
      .updateJobTitle(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.promptService
            .open({ icon: 'error', html: this.promptService.generateErrorMessage(err) })
            .then(() => this.fetch$.next());
        },
      });
  }
}
