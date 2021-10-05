import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../admin-leave-configs.service';
import { loadLeaveTypes, refreshLeaveTypes } from './leave-types.actions';
import { LeaveTypesQuery } from './leave-types.query';
import { LeaveTypesStore } from './leave-types.store';

@Injectable()
export class LeaveTypesEffects {
  @Effect()
  loadLeaveTypes$ = this.actions$.pipe(
    ofType(loadLeaveTypes),
    switchMap(() =>
      cacheable(
        this.store,
        this.leaveConfigServices.getLeaveTypes().pipe(tap((leaveTypes) => this.store.set(leaveTypes)))
      )
    )
  );

  @Effect()
  refreshLeaveTypes$ = this.actions$.pipe(
    ofType(refreshLeaveTypes),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadLeaveTypes())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly leaveConfigServices: AdminLeaveConfigsService,
    private readonly store: LeaveTypesStore,
    private readonly query: LeaveTypesQuery
  ) {}
}
