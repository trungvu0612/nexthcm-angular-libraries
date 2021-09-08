import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseObject,
  JobTitle,
  MY_TIME_API_PATH,
  Org,
  Pagination,
  PagingResponse,
} from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeavePeriod } from './models/leave-period';

export enum LeaveConfigAPIUrlPath {
  Type = 'leaveTypes' as any,
  Period = 'leave-periods' as any,
  Entitlement = 'leave-entitlements' as any,
  ApprovalLevel = 'leave-level-approve' as any,
}

interface LeaveConfigState {
  jobTitles: JobTitle[];
  leaveTypes: BaseObject[];
  leavePeriod: LeavePeriod[];
  org: Org[];
}

@Injectable()
export class LeaveConfigsService extends RxState<LeaveConfigState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('jobTitles', this.getJobTitles());
    this.connect('leaveTypes', this.getLeaveTypes());
    this.connect('leavePeriod', this.getPeriods());
    this.connect('org', this.getOrgs());
  }

  getJobTitles(): Observable<JobTitle[]> {
    return this.http
      .get<PagingResponse<JobTitle>>(`/accountapp/v1.0/titles`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

  getLeaveTypes(): Observable<BaseObject[]> {
    return this.http
      .get<PagingResponse<BaseObject>>(`${MY_TIME_API_PATH}/leaveTypes`, { params: new HttpParams().set('size', 999) })
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
      .pipe(map((response) => response.data.items));
  }

  getConfig<T>(type: LeaveConfigAPIUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${type}/`, { params }).pipe(map((res) => res.data));
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
