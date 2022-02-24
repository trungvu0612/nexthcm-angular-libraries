import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { OrganizationsService } from '../../services';
import { loadOrganizations, refreshOrganizations } from './organizations.actions';
import { OrganizationsQuery } from './organizations.query';
import { OrganizationsStore } from './organizations.store';

@Injectable()
export class OrganizationsEffects {
  @Effect()
  loadOrganizations$ = this.actions$.pipe(
    ofType(loadOrganizations),
    switchMap(() =>
      cacheable(
        this.store,
        this.organizationsService.getBaseOrganizations().pipe(tap((organizations) => this.store.set(organizations)))
      )
    )
  );

  @Effect({ dispatch: true })
  refreshOrganizations$ = this.actions$.pipe(
    ofType(refreshOrganizations),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadOrganizations())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly organizationsService: OrganizationsService,
    private readonly store: OrganizationsStore,
    private readonly query: OrganizationsQuery
  ) {}
}
