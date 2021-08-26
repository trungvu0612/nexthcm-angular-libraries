import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobTitle, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveType, LevelApprove } from '../models/level-approve';

interface ServiceState {
  jobTitles: JobTitle[];
  leaveTypes: LeaveType[];
}

@Injectable()
export class AdminLeaveLevelApproveService extends RxState<ServiceState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('jobTitles', this.getJobTitles());
    this.connect('leaveTypes', this.getLeaveTypes());
  }

  getJobTitles(): Observable<JobTitle[]> {
    return this.http
      .get<PagingResponse<JobTitle>>('/accountapp/v1.0/titles', { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http
      .get<PagingResponse<LeaveType>>(`${MY_TIME_API_PATH}/leaveTypes`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

  getAdminLevelApproves(params: HttpParams): Observable<PagingResponse<LevelApprove>> {
    return this.http.get<PagingResponse<LevelApprove>>(`${MY_TIME_API_PATH}/leave-level-approve/`, { params });
  }

  createAdminLevelApprove(payload: LevelApprove): Observable<LevelApprove> {
    return this.http.post<LevelApprove>(`${MY_TIME_API_PATH}/leave-level-approve`, payload);
  }

  updateAdminLevelApprove(payload: LevelApprove): Observable<LevelApprove> {
    return this.http.put<LevelApprove>(`${MY_TIME_API_PATH}/leave-level-approve/${payload.id}`, payload);
  }

  deleteAdminLevelApprove(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${MY_TIME_API_PATH}/leave-level-approve/${id}`);
  }
}
