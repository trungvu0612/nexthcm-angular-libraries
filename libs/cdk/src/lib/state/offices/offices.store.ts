import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export interface OfficesState extends EntityState<BaseObject, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'offices' })
export class OfficesStore extends EntityStore<OfficesState> {
  constructor() {
    super();
  }
}