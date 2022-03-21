import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseResponse, BaseWorkflow, WorkflowStatus } from '../../models';

interface WorkflowsState {
  workflows: BaseWorkflow[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowsService extends RxState<WorkflowsState> {
  readonly workflows$ = this.select('workflows');
  private readonly loadWorkflows$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('workflows', this.loadWorkflows$.pipe(switchMap(() => this.getAllWorkflows())));
  }

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

  doLoadWorkflows(): void {
    if (!this.get('workflows')) {
      this.loadWorkflows$.next();
    }
  }

  doRefreshWorkflows(): void {
    if (this.get('workflows')) {
      this.loadWorkflows$.next();
    }
  }
}
