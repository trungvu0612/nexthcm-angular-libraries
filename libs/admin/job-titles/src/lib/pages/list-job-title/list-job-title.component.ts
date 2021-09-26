import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobTitle } from '../../models/job-title';
import { AdminJobTitlesService } from '../../services/admin-job-titles.service';
import { UpsertJobTitleComponent } from '../upsert-job-title/upsert-job-title.component';

@Component({
  selector: 'hcm-list-job-title',
  templateUrl: './list-job-title.component.html',
  styleUrls: ['./list-job-title.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListJobTitleComponent extends AbstractServerSortPaginationTableComponent<JobTitle> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_TITLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'createdBy', title: result.createdBy },
        { key: 'createdDate', title: result.createdDate },
        { key: 'lastModifiedDate', title: result.lastModifiedDate },
        { key: 'state', title: result.state },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminJobTitlesService.getAdminJobTitles(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<JobTitle>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private adminJobTitlesService: AdminJobTitlesService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddJobTitle(): void {
    this.openDialog('addNewJobTitle')
      .pipe(
        switchMap((data) => this.adminJobTitlesService.createAdminJobTitle(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addNewJobTitleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  onRemoveJobTitle(id: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteJobTitle'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() =>
            this.adminJobTitlesService
              .deleteAdminJobTitle(id)
              .pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('deleteJobTitleSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditJobTitle(jobTitle: JobTitle): void {
    this.openDialog('editJobTitle', jobTitle)
      .pipe(
        switchMap((data) => this.adminJobTitlesService.updateAdminJobTitle(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateJobTitleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: JobTitle): Observable<JobTitle> {
    return this.dialogService.open<JobTitle>(new PolymorpheusComponent(UpsertJobTitleComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
