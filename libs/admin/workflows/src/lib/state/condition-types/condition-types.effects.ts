import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';

import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadConditionTypes } from './condition-types.actions';
import { ConditionTypesStore } from './condition-types.state';

@Injectable()
export class ConditionTypesEffects {
  @Effect()
  loadConditionTypes$ = this.actions$.pipe(
    ofType(loadConditionTypes),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getConditionTypes().pipe(tap((data) => this.store.set(data))))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: ConditionTypesStore
  ) {}
}
