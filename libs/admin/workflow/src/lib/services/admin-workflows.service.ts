import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseObject, BaseResponse, Pagination, PagingResponse } from '@nexthcm/cdk';
import { insert, RxState, update } from '@rx-angular/state';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ConditionType, PostFunctionType, ValidatorType } from '../enums';
import { InitWorkflow, Status, TransitionOption, Workflow } from '../models';

interface WorkflowsState {
  statusTypes: Status[];
  statuses: Status[];
  conditionTypes: TransitionOption<ConditionType>[];
  validatorTypes: TransitionOption<ValidatorType>[];
  postFunctionTypes: TransitionOption<PostFunctionType>[];
  jobTitles: BaseObject[];
}

@Injectable()
export class AdminWorkflowsService extends RxState<WorkflowsState> {
  private readonly updateStatus$ = new Subject<Status>();
  private readonly createStatus$ = new Subject<Status>();
  private readonly initStatus$ = new Subject();

  constructor(private http: HttpClient) {
    super();
    this.connect('statusTypes', this.getStatusTypes());
    this.connect('conditionTypes', this.getConditionTypes());
    this.connect('validatorTypes', this.getValidatorTypes());
    this.connect('postFunctionTypes', this.getPostFunctionTypes());
    this.connect(
      'statuses',
      this.initStatus$.pipe(
        startWith(null),
        switchMap(() => this.getStatuses())
      )
    );
    this.connect('statuses', this.updateStatus$, (state, status) =>
      update(state.statuses, status, (a, b) => a.id === b.id)
    );
    this.connect('statuses', this.createStatus$, (state, status) => insert(state.statuses, status));
    this.connect('jobTitles', this.getJobTitles());
  }

  getStatusTypes(): Observable<Status[]> {
    return this.http.get<Status[]>(`${ACCOUNT_API_PATH}/states/types`);
  }

  getWorkflow(workflowId: string): Observable<Workflow> {
    return this.http
      .get<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/${workflowId}`)
      .pipe(map((res) => res.data));
  }

  getWorkflows(params: HttpParams): Observable<Pagination<Workflow>> {
    return this.http
      .get<PagingResponse<Workflow>>(`${ACCOUNT_API_PATH}/process`, { params })
      .pipe(map((res) => res.data));
  }

  upsertWorkflow(workflowId: string, payload: Workflow): Observable<BaseResponse<Workflow>> {
    return this.http.put<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/${workflowId}`, payload);
  }

  initWorkflow(payload: InitWorkflow): Observable<BaseResponse<Workflow>> {
    return this.http
      .post<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/init`, payload)
      .pipe(tap(() => this.initStatus$.next()));
  }

  deleteWorkflow(workflowId: string): Observable<unknown> {
    return this.http.delete<unknown>(`${ACCOUNT_API_PATH}/process/${workflowId}`);
  }

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${ACCOUNT_API_PATH}/states`);
  }

  createStatus(payload: Status): Observable<Status> {
    return this.http.post<BaseResponse<Status>>(`${ACCOUNT_API_PATH}/states`, payload).pipe(
      map((res) => res.data),
      tap((data) => this.createStatus$.next(data))
    );
  }

  updateStatus(payload: Status): Observable<unknown> {
    return this.http.put<BaseResponse<unknown>>(`${ACCOUNT_API_PATH}/states/${payload.id}`, payload).pipe(
      map((res) => res.data),
      tap(() => this.updateStatus$.next(payload))
    );
  }

  getConditionTypes(): Observable<TransitionOption<ConditionType>[]> {
    return this.http.get<TransitionOption<ConditionType>[]>(`${ACCOUNT_API_PATH}/conditions/types`);
  }

  getValidatorTypes(): Observable<TransitionOption<ValidatorType>[]> {
    return this.http.get<TransitionOption<ValidatorType>[]>(`${ACCOUNT_API_PATH}/validators/types`);
  }

  getPostFunctionTypes(): Observable<TransitionOption<PostFunctionType>[]> {
    return this.http.get<TransitionOption<PostFunctionType>[]>(`${ACCOUNT_API_PATH}/pfs/types`);
  }

  getJobTitles(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/titles/v2`);
  }

  searchJobTitles(searchQuery: string): Observable<BaseObject[]> {
    return this.select('jobTitles').pipe(
      map((jobTitles) =>
        jobTitles.filter((jobTitle) => jobTitle.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
      )
    );
  }

  getUsers(searchQuery: string): Observable<BaseObject[]> {
    return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(map((res) => res.data));
  }

  getPermissions(searchQuery: string): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/permissions/search?name=${searchQuery}`);
  }
}
