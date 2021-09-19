import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadStatuses, upsertStatus } from './statuses.actions';
import { StatusesStore } from './statuses.state';

@Injectable()
export class StatusesEffects {
  @Effect()
  loadStatuses$ = this.actions$.pipe(
    ofType(loadStatuses),
    switchMap(() =>
      cacheable(this.store, this.adminWorkflowsService.getStatuses().pipe(tap((data) => this.store.set(data))))
    )
  );

  @Effect()
  upsertStatus$ = this.actions$.pipe(
    ofType(upsertStatus),
    tap(({ data }) => this.store.upsert(data.id, data))
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly store: StatusesStore
  ) {}
}
