import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { EmployeeIndividual } from '@nexthcm/cdk';

@Injectable()
@StoreConfig({ name: 'employee-individual' })
export class EmployeeIndividualStore extends Store<EmployeeIndividual> {
  constructor() {
    super({});
  }
}

@Injectable()
export class EmployeeIndividualQuery extends Query<EmployeeIndividual> {
   constructor(protected store: EmployeeIndividualStore) {
    super(store);
  }
}
