import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';

import { PostFunctionType } from '../../enums';
import { TransitionOption } from '../../models';

export type PostFunctionTypesState = EntityState<TransitionOption<PostFunctionType>, string>

@Injectable()
@StoreConfig({ name: 'post-function-types' })
export class PostFunctionsTypesStore extends EntityStore<PostFunctionTypesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class PostFunctionTypesQuery extends QueryEntity<PostFunctionTypesState> {
  constructor(protected store: PostFunctionsTypesStore) {
    super(store);
  }
}
