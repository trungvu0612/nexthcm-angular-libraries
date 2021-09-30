import { Component, Input } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'hcm-updated-knowledge-category',
  templateUrl: './updated-knowledge-category.component.html',
  styleUrls: ['./updated-knowledge-category.component.scss'],
})
export class UpdatedKnowledgeCategoryComponent {
  readonly params$ = new BehaviorSubject<{ search?: string; size: number }>({ size: 10 });
  readonly knowledgeBase$ = this.params$.pipe(
    switchMap((params) => this.knowledgeBaseService.getKnowledgeBaseCategory(params, this.routerQuery.getParams('id')))
  );

  constructor(private readonly knowledgeBaseService: KnowledgeBaseService, private readonly routerQuery: RouterQuery) {}

  @Input() set search(search$: Observable<string>) {
    search$.pipe(map((search) => ({ search: search, size: 0 }))).subscribe(this.params$);
  }

  viewMore() {
    this.params$.next(Object.assign(this.params$.value, { size: this.params$.value.size + 10 }));
  }
}
