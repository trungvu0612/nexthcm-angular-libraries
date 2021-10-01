import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACCOUNT_API_PATH } from '../../constants';
import { BaseResponse, WorkflowStatus } from '../../models';
import { Workflow } from '../../models/workflow';

@Injectable({
  providedIn: 'root',
})
export class WorkflowsService {
  constructor(private http: HttpClient) {}

  getAllWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${ACCOUNT_API_PATH}/process/all`);
  }

  searchWorkflowStatuses(search: string): Observable<WorkflowStatus[]> {
    return this.http
      .get<BaseResponse<WorkflowStatus[]>>(`${ACCOUNT_API_PATH}/states?name=${search}`)
      .pipe(map((res) => res.data));
  }

  getWorkflowStatus(id: string): Observable<WorkflowStatus> {
    return this.http.get<BaseResponse<WorkflowStatus>>(`${ACCOUNT_API_PATH}/states/${id}`).pipe(map((res) => res.data));
  }
}
