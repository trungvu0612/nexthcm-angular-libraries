import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Requests } from '../../models/requests';

export interface MyRequestState extends EntityState<Requests> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'leave-type-management' })
export class MyRequestStore extends EntityStore<MyRequestState> {
  constructor() {
    super();
  }
}
