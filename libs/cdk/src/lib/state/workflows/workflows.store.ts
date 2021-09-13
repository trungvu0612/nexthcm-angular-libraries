import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Workflow } from '../../models/workflow';

export interface WorkflowsState extends EntityState<Workflow, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflows', idKey: 'processId' })
export class WorkflowsStore extends EntityStore<WorkflowsState> {
  constructor() {
    super();
  }
}
