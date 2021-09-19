import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { EmailTemplate } from '../../models';

export interface EmailTemplatesState extends EntityState<EmailTemplate, string> {}

@Injectable()
@StoreConfig({ name: 'email-templates' })
export class EmailTemplatesStore extends EntityStore<EmailTemplatesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class EmailTemplatesQuery extends QueryEntity<EmailTemplatesState> {
  constructor(protected store: EmailTemplatesStore) {
    super(store);
  }
}
