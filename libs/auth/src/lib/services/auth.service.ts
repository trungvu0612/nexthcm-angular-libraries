import { Injectable } from '@angular/core';
import { User } from '../models/users/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UsersStore } from '../state/users/users-store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private usersStore: UsersStore,
    private httpClient: HttpClient
  ) {
  }

  login(userData: User): Observable<any> {
    const apiUrl = 'https://dev-nexthcm-api.banvien.com.vn';
    return this.httpClient.post<User>(apiUrl + '/accountapp/v1.0/auth',
      undefined,
      {
        params: new HttpParams()
          .append('username', userData.username ? userData.username : '')
          .append('password', userData.password ? userData.password : '')
      });
  }
}
