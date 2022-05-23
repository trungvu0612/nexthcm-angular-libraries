import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
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

const jwtHelperService = new JwtHelperService();

const saveToken = (access_token: string, refresh_token: string, rememberMe: boolean = true): void => {
  localStorage.setItem('access_token', access_token);
  rememberMe && localStorage.setItem('refresh_token', refresh_token);
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
    private readonly httpClient: HttpClient,
    private readonly swPush: SwPush,
    private readonly permissionsService: PermissionsService
  ) {
    super();
    const access_token = localStorage.getItem('access_token');
    if (access_token) this.setState(access_token);
  }

  readonly userId = () => this.get('userInfo', 'userId');

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.set({ userInfo: undefined, access_token: undefined });
    this.permissionsService.flushPermissions();
  }

  login({ rememberMe, ...payload }: LoginPayload): Observable<PermissionsResponse> {
    return this.http.post<AuthInfo>(`${this.env.apiUrl}/accountapp/v1.0/auth`, payload).pipe(
      tap(({ access_token, refresh_token }) => {
        saveToken(access_token, refresh_token, rememberMe);
        this.setState(access_token);
        this.subscribeToNotifications();
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
            saveToken(access_token, refresh_token);
          })
        )
      : throwError(null);
  }

  private setState(access_token: string): void {
    let userInfo: UserInfo;
    try {
      userInfo = jwtHelperService.decodeToken(access_token) || { userId: '' };
    } catch {
      userInfo = { userId: '' };
    }
    this.set({ access_token, userInfo });
  }

  private subscribeToNotifications(): void {
    this.swPush
      .requestSubscription({
        serverPublicKey: 'BIKdzzy8cQ05ooh1y-QQwLvCr6UCSA75ePYkU2IBzdC4KJoItU0eHP0EGh5hrH_Er58gJFSB9FddZFYM5Q9C_p4',
      })
      .then((sub) => this.httpClient.post('/todo', sub).subscribe())
      .catch((e) => e);
  }
}
