import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeDuration } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-duration' })
export class EmployeeDurationStore extends Store<EmployeeDuration> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeDurationQuery extends Query<EmployeeDuration> {
  constructor(protected store: EmployeeDurationStore) {
    super(store);
  }
}
