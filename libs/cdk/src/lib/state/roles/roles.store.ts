import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export interface roles extends EntityState<BaseObject, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roles' })
export class RolesStore extends EntityStore<roles> {
  constructor() {
    super();
  }
}
