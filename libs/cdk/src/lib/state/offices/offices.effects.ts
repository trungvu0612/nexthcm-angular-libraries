import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { loadOffices, refreshOffices } from './offices.actions';
import { OfficesQuery } from './offices.query';
import { OfficesService } from './offices.service';
import { OfficesStore } from './offices.store';

@Injectable()
export class OfficesEffects {
  @Effect()
  loadOffices$ = this.actions$.pipe(
    ofType(loadOffices),
    switchMap(() =>
      cacheable(this.store, this.officesService.getOffices().pipe(tap((offices) => this.store.set(offices))))
    )
  );

  @Effect({ dispatch: true })
  refreshOffices$ = this.actions$.pipe(
    ofType(refreshOffices),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadOffices())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly officesService: OfficesService,
    private readonly store: OfficesStore,
    private readonly query: OfficesQuery
  ) {}
}
