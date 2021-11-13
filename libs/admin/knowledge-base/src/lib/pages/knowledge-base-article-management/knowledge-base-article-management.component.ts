import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseArticle, KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
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
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-knowledge-base-article-management',
  templateUrl: './knowledge-base-article-management.component.html',
  styleUrls: ['./knowledge-base-article-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class KnowledgeBaseArticleManagementComponent extends AbstractServerSortPaginationTableComponent<KnowledgeBaseArticle> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ARTICLES_MANAGEMENT_COLUMNS', {}, TRANSLATION_SCOPE)
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
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.knowledgeBaseService.getKnowledgeBaseArticles(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<KnowledgeBaseArticle>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService
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
        this.promptService.handleResponse('adminKnowledgeBase.deleteArticleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
