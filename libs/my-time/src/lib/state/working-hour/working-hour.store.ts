import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WorkingHour } from '../../models/working-hour';

export interface WorkingHourState extends EntityState<WorkingHour> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'working-hour-management' })
export class WorkingHourStore extends EntityStore<WorkingHourState> {
  constructor() {
    super();
  }
}
