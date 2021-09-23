import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminUserRole, Policy } from '../models/admin-user-role';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root'
})
export class AdminUserRolesService {
  constructor(private http: HttpClient) {
  }

  getAdminUserRoles(params: HttpParams): Observable<Pagination<AdminUserRole>> {
    return this.http
      .get<PagingResponse<AdminUserRole>>(`${MY_ACCOUNT_PATH}/roles`, { params })
      .pipe(map((res) => res.data));
  }

  getAdminUserRolesId(id: AdminUserRole): Observable<any> {
    return this.http.get<any>(`${MY_ACCOUNT_PATH}/roles/${id.id}`, {}).pipe(map((res) => res as any));
  }

  createAdminUserRole(payload: AdminUserRole): Observable<AdminUserRole> {
    return this.http.post<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles`, payload);
  }

  editAdminUserRoleId(payload: AdminUserRole): Observable<AdminUserRole> {
    return this.http.post<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles/${payload.id}`, payload);
  }

  deleteAdminUserRoleId(id: string): Observable<AdminUserRole> {
    return this.http.delete<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles/${id}`);
  }

  getPermissions(params: { [key: string]: number }): Observable<Pagination<Policy>> {
    return this.http
      .get<PagingResponse<Policy>>(`${MY_ACCOUNT_PATH}/permissions`, { params })
      .pipe(map((response) => response.data));
  }

  checkName(search: string): Observable<boolean> {
    return this.http.post<boolean>(`${MY_ACCOUNT_PATH}/roles-by-name`, search).pipe(
      map((value) => !value),
      catchError(() => of(false))
    );
  }

}
