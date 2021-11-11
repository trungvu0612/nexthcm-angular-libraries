import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { SeatMap } from '../../models';

export interface SeatMapsState extends EntityState<SeatMap, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'seat-maps' })
export class SeatMapsStore extends EntityStore<SeatMapsState> {
  constructor() {
    super();
  }
}

@Injectable({ providedIn: 'root' })
export class SeatMapsQuery extends QueryEntity<SeatMapsState> {
  constructor(protected store: SeatMapsStore) {
    super(store);
  }
}
