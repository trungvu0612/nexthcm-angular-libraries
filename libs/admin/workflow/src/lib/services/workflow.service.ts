import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatusType } from '../models/status-type';
import { InitWorkflow, Workflow } from '../models/workflow';

const WORKFLOWS_PATH = 'workflowapp/v1.0';

interface WorkflowState {
  statusTypes: StatusType[];
}

@Injectable()
export class WorkflowService extends RxState<WorkflowState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('statusTypes', this.getStatusTypes().pipe(map((res) => res.data.items)));
  }

  getStatusTypes(): Observable<PagingResponse<StatusType>> {
    return this.http.get<PagingResponse<StatusType>>(`/${WORKFLOWS_PATH}/states/types`);
  }

  getProcess(processId: string): Observable<BaseResponse<Workflow>> {
    return this.http.get<BaseResponse<Workflow>>(`/${WORKFLOWS_PATH}/process/${processId}`);
  }

  getProcesses(params: HttpParams): Observable<PagingResponse<Workflow>> {
    return this.http.get<PagingResponse<Workflow>>(`/${WORKFLOWS_PATH}/process`, { params });
  }

  upsertProcess(processId: string, payload: Workflow): Observable<BaseResponse<Workflow>> {
    return this.http.put<BaseResponse<Workflow>>(`/${WORKFLOWS_PATH}/process/${processId}`, payload);
  }

  initProcess(payload: InitWorkflow): Observable<BaseResponse<Workflow>> {
    return this.http.post<BaseResponse<Workflow>>(`/${WORKFLOWS_PATH}/process/init`, payload);
  }

  deleteProcess(processId: string): Observable<unknown> {
    return this.http.delete<unknown>(`/process/${processId}`);
  }
}
