import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { loadRoles, refreshRoles } from './roles.actions';
import { RolesQuery } from './roles.query';
import { RolesService } from './roles.service';
import { RolesStore } from './roles.store';

@Injectable()
export class RolesEffects {
  @Effect()
  loadRoles$ = this.actions$.pipe(
    ofType(loadRoles),
    switchMap(() => cacheable(this.store, this.rolesService.getRoles().pipe(tap((roles) => this.store.set(roles)))))
  );

  @Effect({ dispatch: true })
  refreshRoles$ = this.actions$.pipe(
    ofType(refreshRoles),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadRoles())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly rolesService: RolesService,
    private readonly store: RolesStore,
    private readonly query: RolesQuery
  ) {}
}
