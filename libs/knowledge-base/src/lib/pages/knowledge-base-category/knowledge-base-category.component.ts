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
  private readonly request$ = this.knowledgeBaseService
    .getKnowledgeBaseCategory(this.activatedRoute.snapshot.params.categoryId)
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
}
