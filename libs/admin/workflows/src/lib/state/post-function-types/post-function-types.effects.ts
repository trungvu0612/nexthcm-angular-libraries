import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';

import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadPostFunctionTypes } from './post-function-types.actions';
import { PostFunctionsTypesStore } from './post-function-types.state';

@Injectable()
export class PostFunctionTypesEffects {
  @Effect()
  loadPostFunctionTypes$ = this.actions$.pipe(
    ofType(loadPostFunctionTypes),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getPostFunctionTypes().pipe(tap((data) => this.store.set(data))))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: PostFunctionsTypesStore
  ) {}
}
