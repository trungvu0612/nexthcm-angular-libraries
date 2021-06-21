import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Process, ProcessInit } from '../models/process';
import { StatusType } from '../models/status-type';

const WORKFLOWS_PATH = 'workflowapp/v1.0';

interface ProcessesState {
  statusTypes: StatusType[];
}

@Injectable()
export class ProcessesService extends RxState<ProcessesState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('statusTypes', this.getStatusTypes().pipe(map((res) => res.data.items)));
  }

  getStatusTypes(): Observable<PagingResponse<StatusType>> {
    return this.http.get<PagingResponse<StatusType>>(`/${WORKFLOWS_PATH}/states/types`);
  }

  getProcess(processId: string): Observable<BaseResponse<Process>> {
    return this.http.get<BaseResponse<Process>>(`/${WORKFLOWS_PATH}/process/${processId}`);
  }

  getProcesses(params: HttpParams): Observable<PagingResponse<Process>> {
    return this.http.get<PagingResponse<Process>>(`/${WORKFLOWS_PATH}/process`, { params });
  }

  upsertProcess(processId: string, payload: Process): Observable<BaseResponse<Process>> {
    return this.http.put<BaseResponse<Process>>(`/${WORKFLOWS_PATH}/process/${processId}`, payload);
  }

  initProcess(payload: ProcessInit): Observable<BaseResponse<Process>> {
    return this.http.post<BaseResponse<Process>>(`/${WORKFLOWS_PATH}/process/init`, payload);
  }

  deleteProcess(processId: string): Observable<unknown> {
    return this.http.delete<unknown>(`/process/${processId}`);
  }
}
