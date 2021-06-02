import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MyRequestState, MyRequestStore } from './my-request.store';

@Injectable({ providedIn: 'root' })
export class MyRequestQuery extends QueryEntity<MyRequestState> {
  constructor(protected store: MyRequestStore) {
    super(store);
  }
}
