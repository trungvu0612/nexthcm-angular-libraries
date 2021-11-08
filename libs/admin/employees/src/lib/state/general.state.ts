import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeGeneralInformation } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-general' })
export class EmployeeGeneralStore extends Store<EmployeeGeneralInformation> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeGeneralQuery extends Query<EmployeeGeneralInformation> {
  constructor(protected store: EmployeeGeneralStore) {
    super(store);
  }
}
