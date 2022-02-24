import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';

import { ConditionType } from '../../enums';
import { TransitionOption } from '../../models';

export type ConditionTypesState = EntityState<TransitionOption<ConditionType>, string>

@Injectable()
@StoreConfig({ name: 'condition-types' })
export class ConditionTypesStore extends EntityStore<ConditionTypesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class ConditionTypesQuery extends QueryEntity<ConditionTypesState> {
  constructor(protected store: ConditionTypesStore) {
    super(store);
  }
}
