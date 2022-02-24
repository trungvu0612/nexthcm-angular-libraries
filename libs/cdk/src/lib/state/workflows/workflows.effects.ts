import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { WorkflowsService } from '../../services';
import { loadWorkflows, refreshWorkflows } from './workflows.actions';
import { WorkflowsQuery } from './workflows.query';
import { WorkflowsStore } from './workflows.store';

@Injectable()
export class WorkflowsEffects {
  @Effect()
  loadWorkflows$ = this.actions$.pipe(
    ofType(loadWorkflows),
    switchMap(() =>
      cacheable(
        this.store,
        this.workflowsService.getAllWorkflows().pipe(tap((workflows) => this.store.set(workflows)))
      )
    )
  );

  @Effect({ dispatch: true })
  refreshWorkflows$ = this.actions$.pipe(
    ofType(refreshWorkflows),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadWorkflows())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly workflowsService: WorkflowsService,
    private readonly store: WorkflowsStore,
    private readonly query: WorkflowsQuery,
  ) {}
}
