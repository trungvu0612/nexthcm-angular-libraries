import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '@nexthcm/cdk';

export interface LeaveTypesState extends EntityState<BaseObject, string> {}

@Injectable()
@StoreConfig({ name: 'leave-types' })
export class LeaveTypesStore extends EntityStore<LeaveTypesState> {
  constructor() {
    super();
  }
}
