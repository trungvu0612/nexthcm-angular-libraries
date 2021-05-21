import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from '../../models/users/user.model';

export interface UsersState extends EntityState<User> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users', idKey: 'userId' })
export class UsersStore extends EntityStore<UsersState> {
  constructor() {
    super();
  }
}
