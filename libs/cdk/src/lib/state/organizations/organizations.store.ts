import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export interface OrganizationsState extends EntityState<BaseObject, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organizations' })
export class OrganizationsStore extends EntityStore<OrganizationsState> {
  constructor() {
    super();
  }
}
