import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseCategory, KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent } from 'ngx-easy-table';
import { from, iif, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import { UpsertKnowledgeBaseCategoryDialogComponent } from '../../components/upsert-knowledge-base-category-dialog/upsert-knowledge-base-category-dialog.component';

@Component({
  selector: 'hcm-knowledge-base-category-management',
  templateUrl: './knowledge-base-category-management.component.html',
  styleUrls: ['./knowledge-base-category-management.component.scss'],
  providers: [RxState, TuiDestroyService],
})
export class KnowledgeBaseCategoryManagementComponent extends AbstractServerSortPaginationTableComponent<KnowledgeBaseCategory> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$ = this.translocoService
    .selectTranslateObject('CATEGORY_MANAGEMENT_TABLE', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((translate) => [
        { key: 'name', title: translate.name },
        { key: 'description', title: translate.description },
        { key: 'userCreatedBy', title: translate.createdBy },
        { key: 'status', title: translate.status },
        { key: '', title: translate.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.knowledgeBaseService.getKnowledgeBaseCategories(this.queryParams$.value).pipe(startWith(null))
    ),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<KnowledgeBaseCategory>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
    private readonly injector: Injector
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  upsertKnowledgeBaseCategory(data?: KnowledgeBaseCategory): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertKnowledgeBaseCategoryDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'editCategory' : 'addCategory'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  deleteCategory(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('deleteCategory'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.adminKnowledgeBaseService.deleteKnowledgeBaseCategory(id))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('deleteCategorySuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
