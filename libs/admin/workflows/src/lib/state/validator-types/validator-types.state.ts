import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';

import { ValidatorType } from '../../enums';
import { TransitionOption } from '../../models';

export type ValidatorTypesState = EntityState<TransitionOption<ValidatorType>, string>

@Injectable()
@StoreConfig({ name: 'validator-types' })
export class ValidatorTypesStore extends EntityStore<ValidatorTypesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class ValidatorTypesQuery extends QueryEntity<ValidatorTypesState> {
  constructor(protected store: ValidatorTypesStore) {
    super(store);
  }
}
