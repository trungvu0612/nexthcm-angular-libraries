import { Location } from '@angular/common';
import { Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseCategory, KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EMPTY, from, iif, of, Subject } from 'rxjs';
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

import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import { UpsertKnowledgeBaseCategoryDialogComponent } from '../../components/upsert-knowledge-base-category-dialog/upsert-knowledge-base-category-dialog.component';

@Component({
  selector: 'hcm-knowledge-base-category-management',
  templateUrl: './knowledge-base-category-management.component.html',
  styleUrls: ['./knowledge-base-category-management.component.scss'],
  providers: [RxState, TuiDestroyService],
})
export class KnowledgeBaseCategoryManagementComponent extends AbstractServerSortPaginationTableComponent<KnowledgeBaseCategory> {
  readonly columns$ = this.translocoService
    .selectTranslateObject('CATEGORY_MANAGEMENT_TABLE', {}, this.translocoScope.scope)
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
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.knowledgeBaseService.getKnowledgeBaseCategories(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<KnowledgeBaseCategory>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
    private readonly injector: Injector
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

  upsertKnowledgeBaseCategory(data?: KnowledgeBaseCategory): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertKnowledgeBaseCategoryDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'editCategory' : 'addCategory'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
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
          iif(() => result.isConfirmed, this.adminKnowledgeBaseService.deleteKnowledgeBaseCategory(id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse('deleteCategorySuccessfully', () => this.fetch$.next()));
  }
}
