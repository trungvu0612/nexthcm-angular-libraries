import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthInfo, UserInfo } from '../../models';
import { resetStores, Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

export function createState(token: string): UserInfo {
  const helper = new JwtHelperService();
  return helper.decodeToken(token) || { id: '', org_type: '' };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<UserInfo> {
  constructor(private cookieService: CookieService, private router: Router) {
    super(createState(cookieService.get('access_token')));
  }

  login(authInfo: AuthInfo): void {
    this.update(createState(authInfo.access_token));
    this.cookieService.put('access_token', authInfo.access_token, { path: '' });
  }

  logout(): void {
    this.cookieService.removeAll();
    resetStores({ exclude: ['header', 'sidebar'] });
    this.router.navigateByUrl('/auth');
  }
}
