import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseArticle, KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
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

import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';

@Component({
  selector: 'hcm-knowledge-base-article-management',
  templateUrl: './knowledge-base-article-management.component.html',
  styleUrls: ['./knowledge-base-article-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class KnowledgeBaseArticleManagementComponent extends AbstractServerSortPaginationTableComponent<KnowledgeBaseArticle> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ARTICLES_MANAGEMENT_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'topic', title: result.topic },
        { key: 'shortDescription', title: result.shortDescription },
        { key: 'policyCategory', title: result.category },
        { key: 'userCreatedBy', title: result.createdBy },
        { key: 'status', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.knowledgeBaseService.getKnowledgeBaseArticles(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<KnowledgeBaseArticle>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private knowledgeBaseService: KnowledgeBaseService,
    private adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService
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

  onDeleteKnowledgeBaseArticle(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('adminKnowledgeBase.deleteArticle'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.adminKnowledgeBaseService.deleteKnowledgeBaseArticle(id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('adminKnowledgeBase.deleteArticleSuccessfully', () => this.fetch$.next())
      );
  }
}
