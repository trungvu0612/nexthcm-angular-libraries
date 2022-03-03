import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { EmailVariable } from '@nexthcm/cdk';

export type TemplateVariablesState = EntityState<EmailVariable, string>;

@Injectable()
@StoreConfig({ name: 'workflow-template-variables' })
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
