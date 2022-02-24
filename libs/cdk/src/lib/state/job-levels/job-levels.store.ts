import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { BaseObject } from '../../models';

export type JobLevelsState = EntityState<BaseObject, string>;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'job-levels' })
export class JobLevelsStore extends EntityStore<JobLevelsState> {
  constructor() {
    super();
  }
}
