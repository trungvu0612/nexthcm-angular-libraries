import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export type OfficesState = EntityState<BaseObject, string>;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'offices' })
export class OfficesStore extends EntityStore<OfficesState> {
  constructor() {
    super();
  }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'onsite-offices' })
export class OnsiteOfficesStore extends EntityStore<OfficesState> {
  constructor() {
    super();
  }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'wfh-offices' })
export class WFHOfficesStore extends EntityStore<OfficesState> {
  constructor() {
    super();
  }
}
