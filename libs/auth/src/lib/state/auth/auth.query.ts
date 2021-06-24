import { Injectable } from '@angular/core';
import { Query, toBoolean } from '@datorama/akita';
import { UserInfo } from '../../models';
import { AuthStore } from './auth-store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<UserInfo> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  isLoggedIn(): boolean {
    return toBoolean(this.getValue().userId);
  }
}
