import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LeaveType } from '../../models/leave-type';

export interface LeaveTypeState extends EntityState<LeaveType> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truck-yard-management', idKey: 'truckYardId' })
export class LeaveTypeStore extends EntityStore<LeaveTypeState> {
  constructor() {
    super();
  }
}
