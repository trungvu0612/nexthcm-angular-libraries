import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { Policy, UserRole } from '../models/user-role';

@Injectable()
export class AdminUserRolesService {
  constructor(private http: HttpClient) {}

  getUserRoles(params: HttpParams): Observable<Pagination<UserRole>> {
    return this.http
      .get<PagingResponse<UserRole>>(`${ACCOUNT_API_PATH}/roles`, { params })
      .pipe(map((res) => res.data));
  }

  getAdminUserRolesId(id: UserRole): Observable<any> {
    return this.http.get<any>(`${ACCOUNT_API_PATH}/roles/${id.id}`, {}).pipe(map((res) => res as any));
  }

  upsertUserRole(payload: UserRole): Observable<unknown> {
    return payload.id ? this.editUserRole(payload) : this.createUserRole(payload);
  }

  createUserRole(payload: UserRole): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/roles`, payload);
  }

  editUserRole(payload: UserRole): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/roles/${payload.id}`, payload);
  }

  deleteAdminUserRoleId(id: string): Observable<UserRole> {
    return this.http.delete<UserRole>(`${ACCOUNT_API_PATH}/roles/${id}`);
  }

  getPermissions(params: { [key: string]: number }): Observable<Pagination<Policy>> {
    return this.http
      .get<PagingResponse<Policy>>(`${ACCOUNT_API_PATH}/permissions`, { params })
      .pipe(map((response) => response.data));
  }

  checkNameExisting(payload: Pick<UserRole, 'name'>): Observable<boolean> {
    return this.http.post(`${ACCOUNT_API_PATH}/roles/check-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
