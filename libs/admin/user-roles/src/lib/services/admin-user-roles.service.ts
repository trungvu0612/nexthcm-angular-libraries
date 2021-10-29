import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { BasePermission } from '../models/base-permission';
import { UserRole } from '../models/user-role';

@Injectable()
export class AdminUserRolesService {
  constructor(private http: HttpClient) {}

  getUserRoles(params: HttpParams): Observable<Pagination<UserRole>> {
    return this.http
      .get<PagingResponse<UserRole>>(`${ACCOUNT_API_PATH}/roles`, { params })
      .pipe(map((res) => res.data));
  }

  upsertUserRole(payload: UserRole): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/roles`, payload);
  }

  deleteAdminUserRoleId(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/roles/${id}`);
  }

  getPermissions(searchTerm: string | null): Observable<BasePermission[]> {
    return searchTerm
      ? this.http
          .get<BaseResponse<BasePermission[]>>(`${ACCOUNT_API_PATH}/permissions/v2`, {
            params: new HttpParams().set('name', searchTerm),
          })
          .pipe(map((response) => response.data))
      : of([]);
  }

  checkNameExisting(payload: Pick<UserRole, 'name'>): Observable<boolean> {
    return this.http.post(`${ACCOUNT_API_PATH}/roles/check-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
