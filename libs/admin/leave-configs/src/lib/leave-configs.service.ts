import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { LeaveConfig } from './models/leave-config';
import { Process } from './models/process';

@Injectable({
  providedIn: 'root',
})
export class LeaveConfigsService {
  constructor(private httpClient: HttpClient) {}

  getLeaveTypes(params: HttpParams): Observable<PagingResponse<LeaveConfig>> {
    return this.httpClient.get<PagingResponse<LeaveConfig>>(`${MY_TIME_API_PATH}/leaveTypes`, { params });
  }

  getLeaveType(id: string): Observable<BaseResponse<LeaveConfig>> {
    return this.httpClient.get<BaseResponse<LeaveConfig>>(`${MY_TIME_API_PATH}/leaveTypes/${id}`);
  }

  createLeaveType(dto: LeaveConfig): Observable<LeaveConfig> {
    return this.httpClient.post<LeaveConfig>(`${MY_TIME_API_PATH}/leaveTypes`, dto);
  }

  editLeaveType(dto: LeaveConfig): Observable<LeaveConfig> {
    return this.httpClient.put<LeaveConfig>(`${MY_TIME_API_PATH}/leaveTypes/${dto.id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${MY_TIME_API_PATH}/leaveTypes/${id}`, {});
  }

  getProcesses(params: HttpParams): Observable<PagingResponse<Process>> {
    return this.httpClient.get<PagingResponse<Process>>(`/${ACCOUNT_API_PATH}/process`, { params });
  }

  getProcess(workflowId: string): Observable<BaseResponse<Process>> {
    return this.httpClient.get<BaseResponse<Process>>(`/${ACCOUNT_API_PATH}/process/${workflowId}`);
  }
}
