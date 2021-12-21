import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  loadOffices,
  loadOnsiteOffices,
  loadWFHOffices,
  refreshOffices,
  refreshOnsiteOffices,
  refreshWFHOffices,
} from './offices.actions';
import { OfficesQuery, OnsiteOfficesQuery, WFHOfficesQuery } from './offices.query';
import { OfficesService } from './offices.service';
import { OfficesStore, OnsiteOfficesStore, WFHOfficesStore } from './offices.store';

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

  @Effect()
  loadWFHOffices$ = this.actions$.pipe(
    ofType(loadWFHOffices),
    switchMap(() =>
      cacheable(
        this.workFromHomeOfficesStore,
        this.officesService.getWFHOffices().pipe(tap((offices) => this.workFromHomeOfficesStore.set(offices)))
      )
    )
  );

  @Effect({ dispatch: true })
  refreshWFHOffices$ = this.actions$.pipe(
    ofType(refreshWFHOffices),
    filter(() => this.workFromHomeOfficesQuery.getHasCache()),
    tap(() => this.workFromHomeOfficesStore.setHasCache(false)),
    map(() => loadWFHOffices())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly officesService: OfficesService,
    private readonly officesStore: OfficesStore,
    private readonly officesQuery: OfficesQuery,
    private readonly onsiteOfficesStore: OnsiteOfficesStore,
    private readonly onsiteOfficesQuery: OnsiteOfficesQuery,
    private readonly workFromHomeOfficesStore: WFHOfficesStore,
    private readonly workFromHomeOfficesQuery: WFHOfficesQuery
  ) {}
}
