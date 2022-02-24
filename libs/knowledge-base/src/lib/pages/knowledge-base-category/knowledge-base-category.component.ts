import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPresent } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, filter, map, share, startWith } from 'rxjs/operators';

import { KnowledgeBaseService } from '../../services';

@Component({
  selector: 'hcm-knowledge-base-category',
  templateUrl: './knowledge-base-category.component.html',
  styleUrls: ['./knowledge-base-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseCategoryComponent {
  index = 0;
  readonly queryParams = new HttpParams().set('page', 0).set('size', 10).set('policyCategory.id', this.categoryId);
  private readonly request$ = this.knowledgeBaseService
    .getKnowledgeBaseCategory(this.categoryId)
    .pipe(startWith(null), share());
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );
  readonly category$ = this.request$.pipe(filter(isPresent));

  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  get categoryId(): string {
    return this.activatedRoute.snapshot.params.categoryId;
  }
}
