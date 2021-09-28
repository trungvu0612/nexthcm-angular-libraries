import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OfficesState, OfficesStore } from './offices.store';

@Injectable({ providedIn: 'root' })
export class OfficesQuery extends QueryEntity<OfficesState> {
  constructor(protected store: OfficesStore) {
    super(store);
  }
}
