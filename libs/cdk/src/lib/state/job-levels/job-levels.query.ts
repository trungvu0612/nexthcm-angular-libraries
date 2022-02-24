import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { JobLevelsState, JobLevelsStore } from './job-levels.store';

@Injectable({ providedIn: 'root' })
export class JobLevelsQuery extends QueryEntity<JobLevelsState> {
  constructor(protected store: JobLevelsStore) {
    super(store);
  }
}
