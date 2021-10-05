import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LeaveTypesState, LeaveTypesStore } from './leave-types.store';

@Injectable()
export class LeaveTypesQuery extends QueryEntity<LeaveTypesState> {
  constructor(protected store: LeaveTypesStore) {
    super(store);
  }
}
