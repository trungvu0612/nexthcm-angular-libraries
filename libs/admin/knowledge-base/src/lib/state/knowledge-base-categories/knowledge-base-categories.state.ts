import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { KnowledgeBaseCategory } from '@nexthcm/knowledge-base';

export interface KnowledgeBaseCategoriesState extends EntityState<KnowledgeBaseCategory, string> {}

@Injectable()
@StoreConfig({ name: 'knowledge-base-categories' })
export class KnowledgeBaseCategoriesStores extends EntityStore<KnowledgeBaseCategoriesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class KnowledgeBaseCategoriesQuery extends QueryEntity<KnowledgeBaseCategoriesState> {
  constructor(protected store: KnowledgeBaseCategoriesStores) {
    super(store);
  }
}
