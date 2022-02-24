import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { loadSeatMaps, refreshSeatMaps } from './seat-maps.actions';
import { SeatMapsService } from './seat-maps.service';
import { SeatMapsQuery, SeatMapsStore } from './seat-maps.state';

@Injectable()
export class SeatMapsEffects {
  @Effect()
  loadSeatMaps$ = this.actions$.pipe(
    ofType(loadSeatMaps),
    switchMap(() =>
      cacheable(this.store, this.seatMapsService.getAllSeatMaps().pipe(tap((seatMaps) => this.store.set(seatMaps))))
    )
  );

  @Effect({ dispatch: true })
  refreshSeatMaps$ = this.actions$.pipe(
    ofType(refreshSeatMaps),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadSeatMaps())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly seatMapsService: SeatMapsService,
    private readonly store: SeatMapsStore,
    private readonly query: SeatMapsQuery
  ) {}
}
