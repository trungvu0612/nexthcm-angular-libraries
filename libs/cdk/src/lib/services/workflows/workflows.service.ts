import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ACCOUNT_API_PATH } from '../../constants';
import { BaseResponse, BaseWorkflow, WorkflowStatus } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class WorkflowsService {
  constructor(private http: HttpClient) {}

  getAllWorkflows(): Observable<BaseWorkflow[]> {
    return this.http.get<BaseWorkflow[]>(`${ACCOUNT_API_PATH}/process/all`);
  }

  searchWorkflowStatuses(search: string): Observable<WorkflowStatus[]> {
    return this.http
      .get<BaseResponse<WorkflowStatus[]>>(`${ACCOUNT_API_PATH}/states`, {
        params: new HttpParams().set('name', search),
      })
      .pipe(map((res) => res.data));
  }

  getWorkflowStatus(ids: string): Observable<WorkflowStatus[]> {
    return this.http.get<BaseResponse<WorkflowStatus[]>>(`${ACCOUNT_API_PATH}/states/by-ids/${ids}`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }
}
