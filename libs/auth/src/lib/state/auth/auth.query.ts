import { Injectable } from '@angular/core';
import { AuthStore } from './auth-store';
import { Query, toBoolean } from '@datorama/akita';
import { UserInfo } from '../../models';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<UserInfo> {
  isLoggedIn$ = this.select((state) => !!state.id);

  constructor(protected store: AuthStore) {
    super(store);
  }

  isLoggedIn(): boolean {
    return toBoolean(this.getValue().userId);
  }
}
