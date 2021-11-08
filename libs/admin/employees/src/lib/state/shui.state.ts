import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeSHUI } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-shui' })
export class EmployeeSHUIStore extends Store<EmployeeSHUI> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeSHUIQuery extends Query<EmployeeSHUI> {
  constructor(protected store: EmployeeSHUIStore) {
    super(store);
  }
}
