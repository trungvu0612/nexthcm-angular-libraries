import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { LeaveType } from './models/leave-type';
import { Process } from './models/process';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypesService {
  constructor(private httpClient: HttpClient) {}

  getLeaveTypes(params: HttpParams): Observable<PagingResponse<LeaveType>> {
    return this.httpClient.get<PagingResponse<LeaveType>>(`${MY_TIME_API_PATH}/leaveTypes`, { params });
  }

  getLeaveType(id: string): Observable<BaseResponse<LeaveType>> {
    return this.httpClient.get<BaseResponse<LeaveType>>(`${MY_TIME_API_PATH}/leaveTypes/${id}`);
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient.post<LeaveType>(`${MY_TIME_API_PATH}/leaveTypes`, dto);
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient.put<LeaveType>(`${MY_TIME_API_PATH}/leaveTypes/${id}`, dto);
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
