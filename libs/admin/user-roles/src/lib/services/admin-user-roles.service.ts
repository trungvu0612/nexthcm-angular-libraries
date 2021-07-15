import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminUserRole } from '../models/admin-user-role';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminUserRolesService {

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private http: HttpClient) {}

  getAdminUserRoles(pageIndex: number, pageSize: number): Observable<PagingResponse<AdminUserRole>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<AdminUserRole>>(`${MY_ACCOUNT_PATH}/roles`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminUserRolesId(id: AdminUserRole | string): Observable<any> {
    if (id === undefined || id === '') {
      return this.http.get<any>(this.env.apiUrl + `${MY_ACCOUNT_PATH}/roles/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<any>(this.env.apiUrl + `${MY_ACCOUNT_PATH}/roles/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createAdminUserRole(body: any): Observable<AdminUserRole> {
    return this.http.post<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles`, body);
  }

  editAdminUserRoleId(id: string | undefined, body: any): Observable<AdminUserRole> {
    return this.http.post<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles/`, body);
  }

  deleteAdminUserRoleId(id: string): Observable<AdminUserRole> {
    return this.http.delete<AdminUserRole>(`${MY_ACCOUNT_PATH}/roles/${id}`);
  }
}
