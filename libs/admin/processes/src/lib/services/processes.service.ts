import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { StatusType } from '../models/status-type';
import { Workflow } from '../models/workflow';

const WORKFLOWS_PATH = 'workflowapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class ProcessesService {
  constructor(private http: HttpClient) {}

  createProcess(payload: Workflow, moduleCode = 'myTimeCode'): Observable<any> {
    return this.http.post<any>(`/${WORKFLOWS_PATH}/${moduleCode}/processes`, payload);
  }

  getStatusTypes(): Observable<PagingResponse<StatusType>> {
    return this.http.get<PagingResponse<StatusType>>(`/${WORKFLOWS_PATH}/states/stateTypes`);
  }
}
