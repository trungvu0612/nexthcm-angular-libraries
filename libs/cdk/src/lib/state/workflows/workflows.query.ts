import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WorkflowsState, WorkflowsStore } from './workflows.store';

@Injectable({ providedIn: 'root' })
export class WorkflowsQuery extends QueryEntity<WorkflowsState> {
  constructor(protected store: WorkflowsStore) {
    super(store);
  }
}
