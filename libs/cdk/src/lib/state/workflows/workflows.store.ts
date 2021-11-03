import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BaseWorkflow } from '../../models';

export interface WorkflowsState extends EntityState<BaseWorkflow, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflows' })
export class WorkflowsStore extends EntityStore<WorkflowsState> {
  constructor() {
    super();
  }
}
