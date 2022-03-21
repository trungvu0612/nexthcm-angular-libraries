import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tiptapEditorStyles, TUI_EDITOR_STYLES } from '@taiga-ui/addon-editor';
import { isPresent } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith } from 'rxjs/operators';

import { KnowledgeBaseArticle } from '../../models';
import { KnowledgeBaseService } from '../../services';

@Component({
  selector: 'hcm-knowledge-base-article',
  templateUrl: './knowledge-base-article.component.html',
  styleUrls: ['./knowledge-base-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TUI_EDITOR_STYLES, useValue: tiptapEditorStyles }],
})
export class KnowledgeBaseArticleComponent {
  private readonly request$ = this.knowledgeBaseService
    .getKnowledgeBaseArticle(this.activatedRoute.snapshot.params['articleId'])
    .pipe(startWith(null), share());
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );
  readonly article$: Observable<KnowledgeBaseArticle> = this.request$.pipe(filter(isPresent));

  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly activatedRoute: ActivatedRoute
  ) {}
}
