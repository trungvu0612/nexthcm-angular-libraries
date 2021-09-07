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
import { LeaveEntitlement, LeaveType, Org } from '../models/leave-entitlement';
import { LeavePeriod } from '../models/leave-period';

interface ServiceState {
  jobTitles: JobTitle[];
  leaveTypes: LeaveType[];
  leavePeriod: LeavePeriod[];
  org: Org[];
  emp: UserDto[];
}

@Injectable()
export class AdminEntitlementService extends RxState<ServiceState> {
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

  getAdminEntitlements(params: HttpParams): Observable<PagingResponse<LeaveEntitlement>> {
    return this.http.get<PagingResponse<LeaveEntitlement>>(`${MY_TIME_API_PATH}/leave-entitlements/`, { params });
  }

  createAdminEntitlementOrg(body: LeaveEntitlement): Observable<LeaveEntitlement> {
    return this.http.post<LeaveEntitlement>(`${MY_TIME_API_PATH}/leave-entitlements`, body);
  }

  createAdminEntitlementEmp(body: LeaveEntitlement): Observable<LeaveEntitlement> {
    return this.http.post<LeaveEntitlement>(`${MY_TIME_API_PATH}/leave-entitlements`, body);
  }

  editAdminEntitlement(body: LeaveEntitlement): Observable<LeaveEntitlement> {
    return this.http.put<LeaveEntitlement>(`${MY_TIME_API_PATH}/leave-entitlements/${body.id}`, body);
  }

  deleteAdminEntitlement(id: string): Observable<LeaveEntitlement> {
    return this.http.delete<LeaveEntitlement>(`${MY_TIME_API_PATH}/leave-entitlements/${id}`);
  }
}
