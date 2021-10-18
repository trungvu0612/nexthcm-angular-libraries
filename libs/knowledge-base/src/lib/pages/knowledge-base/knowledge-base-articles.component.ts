import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { KnowledgeBaseArticle } from '../../models';
import { KnowledgeBaseService } from '../../services';

@Component({
  selector: 'hcm-knowledge-base-articles',
  templateUrl: './knowledge-base-articles.component.html',
  styleUrls: ['./knowledge-base-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class KnowledgeBaseArticlesComponent {
  index = 0;
  readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  readonly items$ = this.state.select('items');
  readonly totalPages$ = this.state.select('totalPages');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.knowledgeBaseService.getKnowledgeBaseArticles(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly state: RxState<Pagination<KnowledgeBaseArticle>>,
    private readonly knowledgeBaseService: KnowledgeBaseService
  ) {
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  goToPage(index: number): void {
    this.index = index;
    this.queryParams$.next(this.queryParams$.value.set('page', index.toString()));
  }
}
