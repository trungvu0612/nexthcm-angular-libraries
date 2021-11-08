import { Injectable } from '@angular/core';
import { guid, Query, Store } from '@datorama/akita';

type State = { id: string };

@Injectable()
export class EmployeeStore extends Store<State> {
  constructor() {
    super({ id: '' }, { name: `Employee-${guid()}` });
  }
}

@Injectable()
export class EmployeeQuery extends Query<State> {
  constructor(protected store: EmployeeStore) {
    super(store);
  }
}
