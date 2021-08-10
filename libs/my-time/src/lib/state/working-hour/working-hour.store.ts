import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WorkingHours } from '../../models/working-hours';

export interface WorkingHourState extends EntityState<WorkingHours> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'working-hours-management' })
export class WorkingHourStore extends EntityStore<WorkingHourState> {
  constructor() {
    super();
  }
}
