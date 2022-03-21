import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APP_CONFIG, AppConfig, PermissionsResponse, PermissionsService } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { AuthInfo, LoginPayload, UserInfo } from '../models';

function createState(token?: string): UserInfo {
  const helper = new JwtHelperService();
  try {
    return helper.decodeToken(token) || { userId: '' };
  } catch {
    return { userId: '' };
  }
}

interface AuthState {
  userInfo: UserInfo;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RxState<AuthState> {
  readonly newLogin$ = new Subject<AuthInfo>();
  readonly http = new HttpClient(this.httpBackend);

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private readonly httpBackend: HttpBackend,
    private readonly cookieService: CookieService,
    private readonly permissionsService: PermissionsService
  ) {
    super();
    this.set('userInfo', () => createState(cookieService.get('access_token')));
    this.connect('userInfo', this.newLogin$, (state, authInfo) => createState(authInfo.access_token));
  }

  readonly userId = () => this.get('userInfo', 'userId');

  logout(): void {
    this.cookieService.removeAll();
    this.set({ userInfo: undefined });
    this.permissionsService.flushPermissions();
  }

  login(payload: LoginPayload): Observable<PermissionsResponse> {
    return this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth`, payload).pipe(
      tap((authInfo) => {
        this.cookieService.put('access_token', authInfo.access_token, {
          path: '/',
          expires: payload.rememberMe ? new Date(new Date().getTime() + authInfo.expires_in * 1000) : undefined,
        });
        this.newLogin$.next(authInfo);
      }),
      switchMap(() => this.permissionsService.getPermissions())
    );
  }
}
