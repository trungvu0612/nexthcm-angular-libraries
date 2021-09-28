import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { roles, RolesStore } from './roles.store';

@Injectable({ providedIn: 'root' })
export class RolesQuery extends QueryEntity<roles> {
  constructor(protected store: RolesStore) {
    super(store);
  }
}
