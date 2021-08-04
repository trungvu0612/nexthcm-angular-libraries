import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { LeaveType } from './models/leave-type';
import { Process } from './models/process';

const WORKFLOWS_PATH = 'workflowapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypesService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getLeaveTypes(params: HttpParams): Observable<PagingResponse<LeaveType>> {
    return this.httpClient.get<PagingResponse<LeaveType>>(this.appVersion + '/leaveTypes', { params });
  }

  getLeaveType(id: string): Observable<BaseResponse<LeaveType>> {
    return this.httpClient.get<BaseResponse<LeaveType>>(this.appVersion + '/leaveTypes' + '/' + id);
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient.post<LeaveType>(this.appVersion + '/leaveTypes', dto);
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient.put<LeaveType>(this.appVersion + `/leaveTypes/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/leaveTypes/${id}`, {});
  }

  getProcesses(params: HttpParams): Observable<PagingResponse<Process>> {
    return this.httpClient.get<PagingResponse<Process>>(`/${WORKFLOWS_PATH}/process`, { params });
  }

  getProcess(processId: string): Observable<BaseResponse<Process>> {
    return this.httpClient.get<BaseResponse<Process>>(`/${WORKFLOWS_PATH}/process/${processId}`);
  }
}
