import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveEntitlement, ResLeaveEntitlement } from '../models/leave-entitlement';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminEntitlementService {
  constructor(private http: HttpClient) {}

  getJobTitles(params: { [key: string]: number }): Observable<Pagination<any>> {
    return this.http
      .get<PagingResponse<any>>('/accountapp/v1.0/titles', { params })
      .pipe(map((response) => response.data));
  }

  getLeaveTypes(params: { [key: string]: number }): Observable<Pagination<any>> {
    return this.http
      .get<PagingResponse<any>>(`${MY_TIME_PATH}/leaveTypes`, { params })
      .pipe(map((response) => response.data));
  }

  getPeriods(params: { [key: string]: number }): Observable<Pagination<any>> {
    return this.http
      .get<PagingResponse<any>>(`${MY_TIME_PATH}/leave-periods`, { params })
      .pipe(map((response) => response.data));
  }

  getOrgs(params: { [key: string]: number }): Observable<Pagination<any>> {
    return this.http
      .get<PagingResponse<any>>(`${ACCOUNT_PATH}/orgs/v2`, { params })
      .pipe(map((response) => response.data));
  }

  getUserSameOrgAndChildOrg(params: { [key: string]: number }): Observable<Array<UserDto>> {
    return this.http
      .get<BaseResponse<Array<UserDto>>>(`${ACCOUNT_PATH}/users/get-user-same-org-and-child-org`, { params })
      .pipe(map((response) => response.data));
  }

  getAdminEntitlements(pageIndex: number, pageSize: number): Observable<PagingResponse<LeaveEntitlement>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<LeaveEntitlement>>(`${MY_TIME_PATH}/leave-entitlements/`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminEntitlementId(id: LeaveEntitlement | string): Observable<ResLeaveEntitlement> {
    if (id === undefined || id === '') {
      return this.http
        .get<ResLeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements/`, {})
        .pipe(map((res) => res as any));
    } else {
      return this.http
        .get<ResLeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createAdminEntitlementOrg(body: any): Observable<LeaveEntitlement> {
    return this.http.post<LeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements`, body);
  }

  createAdminEntitlementEmp(body: any): Observable<LeaveEntitlement> {
    return this.http.post<LeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements`, body);
  }

  editAdminEntitlementId(id: LeaveEntitlement | string, body: any): Observable<LeaveEntitlement> {
    return this.http.put<LeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements/${id}`, body);
  }

  deleteAdminEntitlementId(id: string): Observable<LeaveEntitlement> {
    return this.http.delete<LeaveEntitlement>(`${MY_TIME_PATH}/leave-entitlements/${id}`);
  }
}