import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { EmailTemplate } from '../models';

export interface EmailTemplateState extends EntityState<EmailTemplate, string> {}

@Injectable()
@StoreConfig({name: 'email-templates',})
export class EmailTemplatesStore extends EntityStore<EmailTemplateState> {
  constructor() {
    super();
  }
}

@Injectable()
export class EmailTemplatesQuery extends QueryEntity<EmailTemplateState> {
  constructor(protected store: EmailTemplatesStore) {
    super(store);
  }
}
