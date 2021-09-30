import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobLevelService } from '../job-level.service';
import { Level } from '../models/level';
import { UpsertJobLevelComponent } from '../upsert-job-level/upsert-job-level.component';

@Component({
  selector: 'hcm-list-job-level',
  templateUrl: './list-job-level.component.html',
  styleUrls: ['./list-job-level.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListJobLevelComponent extends AbstractServerSortPaginationTableComponent<Level> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_JOB_LEVEL_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.jobLevelService.getLevels(this.queryParams$.value).pipe(startWith(null))),
    share()
  );

  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<Level>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private jobLevelService: JobLevelService,
    private formBuilder: FormBuilder,
    private injector: Injector,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddJobTitle(): void {
    this.openDialog('jobLevel.addNewJobLevel')
      .pipe(
        switchMap((data) => this.jobLevelService.createLevel(data)),
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
            this.jobLevelService
              .deleteAdminJobLevel(id)
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

  onEditJobTitle(level: Level): void {
    this.openDialog('editJobTitle', level)
      .pipe(
        switchMap((data) => this.jobLevelService.editLevel(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateJobTitleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: Level): Observable<Level> {
    return this.dialogService.open<Level>(new PolymorpheusComponent(UpsertJobLevelComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
