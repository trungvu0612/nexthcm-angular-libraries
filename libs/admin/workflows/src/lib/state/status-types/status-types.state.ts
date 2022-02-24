import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { WorkflowStatusType } from '@nexthcm/cdk';

export type StatusTypesState = EntityState<WorkflowStatusType, string>

@Injectable()
@StoreConfig({ name: 'status-types' })
export class StatusTypesStore extends EntityStore<StatusTypesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class StatusTypesQuery extends QueryEntity<StatusTypesState> {
  constructor(protected store: StatusTypesStore) {
    super(store);
  }
}
