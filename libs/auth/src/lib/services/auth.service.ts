import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APP_CONFIG, AppConfig, PermissionsService } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthInfo, LoginPayload, UserInfo } from '../models';

function createState(token: string): UserInfo {
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
  readonly loginPayload$ = new Subject<LoginPayload>();
  readonly loginHandler$ = this.loginPayload$.pipe(switchMap((payload) => this.login(payload)));
  readonly newLogin$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private permissionsService: PermissionsService
  ) {
    super();
    this.set('userInfo', () => createState(cookieService.get('access_token')));
    this.connect('userInfo', this.loginHandler$, (state, authInfo) => createState(authInfo.access_token));
    this.hold(
      this.newLogin$.pipe(
        switchMap(() => this.permissionsService.getPermissions()),
        tap(() => this.router.navigateByUrl('/'))
      )
    );
  }

  logout(): void {
    this.cookieService.removeAll();
    this.set({ userInfo: undefined });
    this.permissionsService.flushPermissions();
    this.router.navigateByUrl('/auth');
  }

  private login(payload: LoginPayload): Observable<AuthInfo> {
    return this.http.post<AuthInfo>('/accountapp/v1.0/auth', payload).pipe(
      tap((authInfo) => {
        this.cookieService.put('access_token', authInfo.access_token, {
          path: '/',
          expires: payload.rememberMe ? new Date(new Date().getTime() + authInfo.expires_in * 1000) : undefined,
        });
        this.newLogin$.next();
      })
    );
  }
}
