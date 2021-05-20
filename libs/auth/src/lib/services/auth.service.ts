import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment, ENVIRONMENT } from '@nexthcm/core';
import { AuthStore } from '../state/auth/auth-store';
import { AuthInfo, LoginPayload } from '../models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private authStore: AuthStore,
    @Inject(ENVIRONMENT) protected env: Environment
  ) {
  }

  login(payload: LoginPayload): Observable<AuthInfo> {
    const params = new URLSearchParams();
    params.append('username', payload.username);
    params.append('password', payload.password);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log(this.env);

    return this.httpClient.post<AuthInfo>(this.env.apiUrl + '/accountapp/v1.0/auth', params.toString(), { headers }).pipe(
      tap((res) => this.authStore.login(res))
    );
  }

  logout(): void {
    this.authStore.logout();
  }
}
