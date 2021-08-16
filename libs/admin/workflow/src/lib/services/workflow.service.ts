import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, WORKFLOWS_API_PATH } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitWorkflow, StatusType, Workflow } from '../models';

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
    return this.http.get<PagingResponse<StatusType>>(`/${WORKFLOWS_API_PATH}/states/types`);
  }

  getWorkflow(processId: string): Observable<BaseResponse<Workflow>> {
    return this.http.get<BaseResponse<Workflow>>(`/${WORKFLOWS_API_PATH}/process/${processId}`);
  }

  getWorkflows(params: HttpParams): Observable<Pagination<Workflow>> {
    return this.http
      .get<PagingResponse<Workflow>>(`/${WORKFLOWS_API_PATH}/process`, { params })
      .pipe(map((res) => res.data));
  }

  upsertWorkflow(processId: string, payload: Workflow): Observable<BaseResponse<Workflow>> {
    return this.http.put<BaseResponse<Workflow>>(`/${WORKFLOWS_API_PATH}/process/${processId}`, payload);
  }

  initWorkflow(payload: InitWorkflow): Observable<BaseResponse<Workflow>> {
    return this.http.post<BaseResponse<Workflow>>(`/${WORKFLOWS_API_PATH}/process/init`, payload);
  }

  deleteWorkflow(processId: string): Observable<unknown> {
    return this.http.delete<unknown>(`/process/${processId}`);
  }
}
