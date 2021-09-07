import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseObject } from '../../models';

export interface JobTitlesState extends EntityState<BaseObject, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'job-titles' })
export class JobTitlesStore extends EntityStore<JobTitlesState> {
  constructor() {
    super();
  }
}
