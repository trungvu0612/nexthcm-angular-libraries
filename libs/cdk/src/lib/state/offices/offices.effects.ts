import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { loadOffices, loadOnsiteOffices, refreshOffices, refreshOnsiteOffices } from './offices.actions';
import { OfficesQuery, OnsiteOfficesQuery } from './offices.query';
import { OfficesService } from './offices.service';
import { OfficesStore, OnsiteOfficesStore } from './offices.store';

@Injectable()
export class OfficesEffects {
  @Effect()
  loadOffices$ = this.actions$.pipe(
    ofType(loadOffices),
    switchMap(() =>
      cacheable(
        this.officesStore,
        this.officesService.getOffices().pipe(tap((offices) => this.officesStore.set(offices)))
      )
    )
  );

  @Effect({ dispatch: true })
  refreshOffices$ = this.actions$.pipe(
    ofType(refreshOffices),
    filter(() => this.officesQuery.getHasCache()),
    tap(() => this.officesStore.setHasCache(false)),
    map(() => loadOffices())
  );

  @Effect()
  loadOnsiteOffices$ = this.actions$.pipe(
    ofType(loadOnsiteOffices),
    switchMap(() =>
      cacheable(
        this.onsiteOfficesStore,
        this.officesService.getOnsiteOffices().pipe(tap((offices) => this.onsiteOfficesStore.set(offices)))
      )
    )
  );

  @Effect({ dispatch: true })
  refreshOnsiteOffices$ = this.actions$.pipe(
    ofType(refreshOnsiteOffices),
    filter(() => this.onsiteOfficesQuery.getHasCache()),
    tap(() => this.onsiteOfficesStore.setHasCache(false)),
    map(() => loadOnsiteOffices())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly officesService: OfficesService,
    private readonly officesStore: OfficesStore,
    private readonly officesQuery: OfficesQuery,
    private readonly onsiteOfficesStore: OnsiteOfficesStore,
    private readonly onsiteOfficesQuery: OnsiteOfficesQuery
  ) {}
}
