import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadStatusTypes } from './status-types.actions';
import { StatusTypesStore } from './status-types.state';

@Injectable()
export class StatusTypesEffects {
  @Effect()
  loadStatusTypes$ = this.actions$.pipe(
    ofType(loadStatusTypes),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getStatusTypes().pipe(tap((data) => this.store.set(data))))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: StatusTypesStore
  ) {}
}
