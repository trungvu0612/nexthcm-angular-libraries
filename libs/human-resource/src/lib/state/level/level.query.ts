import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LevelState, LevelStore } from './level.store';

@Injectable({ providedIn: 'root' })
export class LevelQuery extends QueryEntity<LevelState> {
  constructor(protected store: LevelStore) {
    super(store);
  }
}
