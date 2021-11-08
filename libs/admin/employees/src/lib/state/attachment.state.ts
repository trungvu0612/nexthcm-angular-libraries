import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeAttachment } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-attachment' })
export class EmployeeAttachmentStore extends Store<EmployeeAttachment> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeAttachmentQuery extends Query<EmployeeAttachment> {
  constructor(protected store: EmployeeAttachmentStore) {
    super(store);
  }
}
