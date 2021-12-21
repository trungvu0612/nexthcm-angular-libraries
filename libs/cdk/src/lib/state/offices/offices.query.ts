import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OfficesState, OfficesStore, OnsiteOfficesStore, WFHOfficesStore } from './offices.store';

@Injectable({ providedIn: 'root' })
export class OfficesQuery extends QueryEntity<OfficesState> {
  constructor(protected store: OfficesStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class OnsiteOfficesQuery extends QueryEntity<OfficesState> {
  constructor(protected store: OnsiteOfficesStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class WFHOfficesQuery extends QueryEntity<OfficesState> {
  constructor(protected store: WFHOfficesStore) {
    super(store);
  }
}
