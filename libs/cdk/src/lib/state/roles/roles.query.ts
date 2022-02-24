import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { RolesState, RolesStore } from './roles.store';

@Injectable({ providedIn: 'root' })
export class RolesQuery extends QueryEntity<RolesState> {
  constructor(protected store: RolesStore) {
    super(store);
  }
}
