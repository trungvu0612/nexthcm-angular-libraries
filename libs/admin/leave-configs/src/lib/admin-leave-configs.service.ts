import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseObject, BaseResponse, MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveConfigUrlPaths } from './models/leave-config-url-paths';
import { EmployeeLeaveEntitlement } from './models/leave-entitlement';

export const LEAVE_CONFIGS_URL_PATHS: Readonly<LeaveConfigUrlPaths> = Object.freeze({
  leaveType: 'leaveTypes',
  leaveEntitlement: 'leave-entitlements',
  leaveLevelApproval: 'leave-level-approve',
});

@Injectable()
export class AdminLeaveConfigsService {
  constructor(private http: HttpClient) {}

  searchLeaveTypes(searchTerm: string | null): Observable<BaseObject[]> {
    return searchTerm
      ? this.http
          .get<BaseResponse<BaseObject[]>>(`${MY_TIME_API_PATH}/leaveTypes/v2?name=${searchTerm}`)
          .pipe(map((res) => res.data))
      : of([]);
  }

  getConfig<T>(type: keyof LeaveConfigUrlPaths, params: HttpParams): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${LEAVE_CONFIGS_URL_PATHS[type]}`, { params })
      .pipe(map((res) => res.data));
  }

  upsert<T extends { id: string }>(type: keyof LeaveConfigUrlPaths, payload: T): Observable<unknown> {
    return payload.id ? this.edit<T>(type, payload) : this.create<T>(type, payload);
  }

  create<T extends { id: string }>(type: keyof LeaveConfigUrlPaths, payload: T): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${LEAVE_CONFIGS_URL_PATHS[type]}`, payload);
  }

  edit<T extends { id: string }>(type: keyof LeaveConfigUrlPaths, payload: T): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/${LEAVE_CONFIGS_URL_PATHS[type]}/${payload.id}`, payload);
  }

  delete(type: keyof LeaveConfigUrlPaths, id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/${LEAVE_CONFIGS_URL_PATHS[type]}/${id}`);
  }

  getEmployeeLeaveEntitlements(params: HttpParams): Observable<Pagination<EmployeeLeaveEntitlement>> {
    return this.http
      .get<PagingResponse<EmployeeLeaveEntitlement>>(`${MY_TIME_API_PATH}/leaves/entitlement-view`, { params })
      .pipe(map((res) => res.data));
  }
}
