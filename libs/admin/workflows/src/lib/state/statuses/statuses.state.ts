import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { Status } from '../../models';

export interface StatusesState extends EntityState<Status, string> {}

@Injectable()
@StoreConfig({ name: 'email-templates' })
export class StatusesStore extends EntityStore<StatusesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class StatusesQuery extends QueryEntity<StatusesState> {
  constructor(protected store: StatusesStore) {
    super(store);
  }
}
