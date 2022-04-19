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

const setToken = (access_token: string, refresh_token: string): void => {
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
};

const removeToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RxState<{ userInfo: UserInfo; access_token: string }> {
  readonly newLogin$ = new Subject<void>();
  readonly http = new HttpClient(this.httpBackend);

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private readonly httpBackend: HttpBackend,
    private readonly permissionsService: PermissionsService
  ) {
    super();
    const access_token = localStorage.getItem('access_token');
    if (access_token) this.setState(access_token);
  }

  readonly userId = () => this.get('userInfo', 'userId');

  logout(): void {
    removeToken();
    this.set({ userInfo: undefined, access_token: undefined });
    this.permissionsService.flushPermissions();
  }

  login({ rememberMe, ...payload }: LoginPayload): Observable<PermissionsResponse> {
    return this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth`, payload).pipe(
      tap(({ access_token, refresh_token }) => {
        if (rememberMe) setToken(access_token, refresh_token);
        else removeToken();
        this.setState(access_token);
        this.newLogin$.next();
      }),
      switchMap(() => this.permissionsService.getPermissions())
    );
  }

  refreshToken(): Observable<unknown> {
    const refreshToken = localStorage.getItem('refresh_token');
    return refreshToken
      ? this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth/refresh`, { refreshToken }).pipe(
          tap(({ access_token, refresh_token }) => {
            this.setState(access_token);
            setToken(access_token, refresh_token);
          })
        )
      : throwError(null);
  }

  private setState(access_token: string): void {
    this.set({
      access_token,
      userInfo: createState(access_token),
    });
  }
}
