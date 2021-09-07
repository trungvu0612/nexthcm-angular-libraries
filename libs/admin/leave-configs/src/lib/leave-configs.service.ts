import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseObject,
  BaseResponse,
  JobTitle,
  MY_TIME_API_PATH,
  PagingResponse,
  UserDto,
} from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LeaveType, Org } from '../../../entitlement/src/lib/models/leave-entitlement';
import { LeavePeriod } from '../../../entitlement/src/lib/models/leave-period';

export enum LeaveConfigAPIUrlPath {
  leaveType = 'leaveTypes' as any,
  leavePeriods = 'leave-periods' as any,
  leaveEntitlements = 'leave-entitlements' as any,
  leaveLevelApprove = 'leave-level-approve' as any,
}

@Injectable()
export class LeaveConfigsService extends RxState<any> {

  constructor(private http: HttpClient) {
    super();
    this.connect('jobTitles', this.getJobTitles());
    this.connect('leaveTypes', this.getLeaveTypes());
    this.connect('leavePeriod', this.getPeriods());
    this.connect('org', this.getOrgs());
    this.connect('emp', this.getUserSameOrgAndChildOrg());
  }

  searchUsers(searchQuery: string): Observable<BaseObject[]> {
    return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  getJobTitles(): Observable<JobTitle[]> {
    return this.http
      .get<PagingResponse<JobTitle>>(`/accountapp/v1.0/titles`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http
      .get<PagingResponse<LeaveType>>(`${MY_TIME_API_PATH}/leaveTypes`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

  getPeriods(): Observable<LeavePeriod[]> {
    return this.http
      .get<PagingResponse<LeavePeriod>>(`${MY_TIME_API_PATH}/leave-periods`, {
        params: new HttpParams().set('size', 999),
      })
      .pipe(map((response) => response.data.items));
  }

  getOrgs(): Observable<Org[]> {
    return this.http
      .get<PagingResponse<Org>>(`${ACCOUNT_API_PATH}/orgs/v2`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items ));
  }

  getUserSameOrgAndChildOrg(): Observable<UserDto[]> {
    return this.http
      .get<PagingResponse<UserDto>>(`${ACCOUNT_API_PATH}/users/get-user-same-org-and-child-org`, {
        params: new HttpParams().set('size', 999),
      })
      .pipe(map((response) => response.data.items));
  }

  getConfig<T>(type: LeaveConfigAPIUrlPath, params: HttpParams): Observable<PagingResponse<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${type}/`, { params });
  }

  create<T>(type: LeaveConfigAPIUrlPath, body: T): Observable<T> {
    return this.http.post<T>(`${MY_TIME_API_PATH}/${type}`, body);
  }

  edit<T>(type: LeaveConfigAPIUrlPath, body: any): Observable<T> {
    return this.http.put<T>(`${MY_TIME_API_PATH}/${type}/${body.id}`, body);
  }

  delete<T>(type: LeaveConfigAPIUrlPath, id: string): Observable<T> {
    return this.http.delete<T>(`${MY_TIME_API_PATH}/${type}/${id}`);
  }

}
