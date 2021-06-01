import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Level } from '../../models/level';

export interface LevelState extends EntityState<Level> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'level', idKey: 'id' })
export class LevelStore extends EntityStore<LevelState> {
  constructor() {
    super();
  }
}
