import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WorkingHourState, WorkingHourStore } from './working-hour.store';

@Injectable({ providedIn: 'root' })
export class WorkingHourQuery extends QueryEntity<WorkingHourState> {
  constructor(protected store: WorkingHourStore) {
    super(store);
  }
}
