import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APP_CONFIG, AppConfig, PermissionsResponse, PermissionsService } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable, Subject, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { LoginPayload, UserInfo } from '../models';

interface AuthInfo {
  access_token: string;
  refresh_token: string;
}

const createState = (token: string): UserInfo => {
  const helper = new JwtHelperService();
  try {
    return helper.decodeToken(token) || { userId: '' };
  } catch {
    return { userId: '' };
  }
};

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RxState<{ userInfo: UserInfo }> {
  readonly newLogin$ = new Subject<UserInfo>();
  readonly http = new HttpClient(this.httpBackend);

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private readonly httpBackend: HttpBackend,
    private readonly permissionsService: PermissionsService
  ) {
    super();
    this.set('userInfo', () => createState(localStorage.getItem('access_token') || ''));
    this.connect('userInfo', this.newLogin$);
  }

  readonly userId = () => this.get('userInfo', 'userId');

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.set({ userInfo: undefined });
    this.permissionsService.flushPermissions();
  }

  login({ rememberMe, ...payload }: LoginPayload): Observable<PermissionsResponse> {
    return this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth`, payload).pipe(
      tap(({ access_token, refresh_token }) => {
        if (rememberMe) localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('access_token', access_token);
        this.newLogin$.next(createState(access_token));
      }),
      switchMap(() => this.permissionsService.getPermissions())
    );
  }

  refreshToken(): Observable<unknown> {
    const refreshToken = localStorage.getItem('refresh_token');
    return refreshToken
      ? this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth/refresh`, { refreshToken }).pipe(
          tap(({ access_token, refresh_token }) => {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
          })
        )
      : throwError(null);
  }
}
