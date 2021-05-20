import { Injectable } from '@angular/core';
import {  QueryEntity } from '@datorama/akita';
import {LeaveTypeState, LeaveTypeStore} from "./leave-type.store";

@Injectable({ providedIn: 'root' })
export class LeaveTypeQuery extends QueryEntity<LeaveTypeState> {
  constructor(protected store: LeaveTypeStore) {
    super(store);
  }
}
