import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeEducation } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-education' })
export class EmployeeEducationStore extends Store<EmployeeEducation> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeEducationQuery extends Query<EmployeeEducation> {
  constructor(protected store: EmployeeEducationStore) {
    super(store);
  }
}
