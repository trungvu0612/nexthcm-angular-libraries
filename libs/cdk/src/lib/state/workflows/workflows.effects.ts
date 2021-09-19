import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { WorkflowsService } from '../../services/workflows/workflows.service';
import { loadWorkflows, refreshWorkflows } from './workflows.actions';
import { WorkflowsStore } from './workflows.store';

@Injectable()
export class WorkflowsEffects {
  @Effect()
  loadWorkflows$ = this.actions$.pipe(
    ofType(loadWorkflows),
    switchMap(() =>
      cacheable(
        this.workflowsStore,
        this.workflowsService.getAllWorkflows().pipe(tap((workflows) => this.workflowsStore.set(workflows)))
      )
    )
  );

  @Effect()
  refreshWorkflows$ = this.actions$.pipe(
    ofType(refreshWorkflows),
    tap(() => this.workflowsStore.setHasCache(false)),
    map(() => loadWorkflows())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly workflowsService: WorkflowsService,
    private readonly workflowsStore: WorkflowsStore
  ) {}
}
