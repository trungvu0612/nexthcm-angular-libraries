import { Injectable } from '@angular/core';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { EmailVariable } from '@nexthcm/cdk';

export type NotificationEmailVariablesState = EntityState<EmailVariable, string>;

@Injectable()
@StoreConfig({ name: 'notification-email-variables' })
export class NotificationEmailVariablesStore extends EntityStore<NotificationEmailVariablesState> {
  constructor() {
    super();
  }
}

@Injectable()
export class NotificationEmailVariablesQuery extends QueryEntity<NotificationEmailVariablesState> {
  constructor(protected store: NotificationEmailVariablesStore) {
    super(store);
  }
}
