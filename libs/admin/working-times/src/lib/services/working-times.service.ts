import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseResponse,
  DEFAULT_PAGINATION_DATA,
  EmployeeInfo,
  Holiday,
  HolidayForm,
  MY_TIME_API_PATH,
  Pagination,
  PagingResponse,
} from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Organization, WorkingTimes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WorkingTimesService {
  constructor(private http: HttpClient) {}

  saveSettings(body: Partial<WorkingTimes>): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/config/times`, body);
  }

  getOrgs(): Observable<PagingResponse<Organization>> {
    return this.http.get<PagingResponse<Organization>>(`/accountapp/v1.0/orgs`);
  }

  getOrganizationChart(tenantId: string): Observable<Organization[]> {
    return this.http
      .get<BaseResponse<Organization[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-structure-chart/${tenantId}`)
      .pipe(map((res) => res.data));
  }

  getWorkingHourConfigByOrg(orgId: string): Observable<BaseResponse<WorkingTimes>> {
    return this.http.get<BaseResponse<WorkingTimes>>(
      `${MY_TIME_API_PATH}/config/times/working-hour-config-by-org-id/${orgId}`
    );
  }

  getHolidays(params: HttpParams): Observable<Pagination<Holiday>> {
    return this.http
      .get<PagingResponse<Holiday>>(`${MY_TIME_API_PATH}/holidays`, { params })
      .pipe(map(({ data }) => data));
  }

  upsertHoliday(payload: HolidayForm): Observable<unknown> {
    return payload.id
      ? this.http.put<unknown>(`${MY_TIME_API_PATH}/holidays/${payload.id}`, payload)
      : this.http.post<unknown>(`${MY_TIME_API_PATH}/holidays`, payload);
  }

  deleteHoliday(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/holidays/${id}`);
  }

  getCICOExclusionEmployees(params: HttpParams): Observable<Pagination<EmployeeInfo>> {
    return this.http
      .get<PagingResponse<EmployeeInfo>>(`${ACCOUNT_API_PATH}/users/time-checking-exclusion`, { params })
      .pipe(
        map((res) => res.data),
        catchError(() => of(DEFAULT_PAGINATION_DATA))
      );
  }

  updateCICOExclusionEmployee(employeeId: string, payload: { isSkipCheckInOutNormal: boolean }): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/users/time-checking-exclusion/${employeeId}`, payload);
  }
}
