import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export type RolesState = EntityState<BaseObject, string>;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roles' })
export class RolesStore extends EntityStore<RolesState> {
  constructor() {
    super();
  }
}
