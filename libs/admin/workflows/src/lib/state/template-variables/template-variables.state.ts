import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';

import { TemplateVariableModel } from '../../models';

export type TemplateVariablesState = EntityState<TemplateVariableModel, string>

@Injectable()
@StoreConfig({ name: 'template-variables' })
export class TemplateVariablesStore extends EntityStore<TemplateVariablesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class TemplateVariablesQuery extends QueryEntity<TemplateVariablesState> {
  constructor(protected store: TemplateVariablesStore) {
    super(store);
  }
}
