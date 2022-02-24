import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';

import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import {
  loadKnowledgeBaseCategories,
  removeKnowledgeBaseCategory,
  upsertKnowledgeBaseCategory,
} from './knowledge-base-categories.actions';
import { KnowledgeBaseCategoriesStores } from './knowledge-base-categories.state';

@Injectable()
export class KnowledgeBaseCategoriesEffects {
  @Effect()
  loadWorkflows$ = this.actions$.pipe(
    ofType(loadKnowledgeBaseCategories),
    switchMap(() =>
      cacheable(
        this.store,
        this.adminKnowledgeBaseService
          .getAllKnowledgeBaseCategories()
          .pipe(tap((categories) => this.store.set(categories)))
      )
    )
  );

  @Effect()
  upsertKnowledgeBaseCategory$ = this.actions$.pipe(
    ofType(upsertKnowledgeBaseCategory),
    tap(({ data }) => this.store.upsert(data.id, data))
  );

  @Effect()
  removeKnowledgeBaseCategory$ = this.actions$.pipe(
    ofType(removeKnowledgeBaseCategory),
    tap(({ id }) => this.store.remove(id))
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private readonly store: KnowledgeBaseCategoriesStores
  ) {}
}
