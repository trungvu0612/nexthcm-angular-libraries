import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import {
  ACCOUNT_API_PATH,
  BaseObject,
  BaseResponse,
  Pagination,
  PagingResponse,
  refreshWorkflows,
  WorkflowStatusType,
} from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { ConditionType, PostFunctionType, ValidatorType } from '../enums';
import { EmailTemplate, InitWorkflow, Status, TemplateVariableModel, TransitionOption, Workflow } from '../models';
import { removeEmailTemplate, upsertEmailTemplate, upsertStatus } from '../state';

@Injectable()
export class AdminWorkflowsService {
  constructor(private readonly http: HttpClient, private readonly actions: Actions) {}

  getStatusTypes(): Observable<WorkflowStatusType[]> {
    return this.http.get<WorkflowStatusType[]>(`${ACCOUNT_API_PATH}/states/types`).pipe(catchError(() => of([])));
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
    return this.http
      .put<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/${workflowId}`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshWorkflows())));
  }

  initWorkflow(payload: InitWorkflow): Observable<BaseResponse<Workflow>> {
    return this.http
      .post<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/init`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshWorkflows())));
  }

  deleteWorkflow(workflowId: string): Observable<unknown> {
    return this.http
      .delete<unknown>(`${ACCOUNT_API_PATH}/process/${workflowId}`)
      .pipe(tap(() => this.actions.dispatch(refreshWorkflows())));
  }

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${ACCOUNT_API_PATH}/states`).pipe(catchError(() => of([])));
  }

  checkStatusName(payload: Pick<Status, 'name'>): Observable<boolean> {
    return this.http.post<boolean>(`${ACCOUNT_API_PATH}/states/existing`, payload).pipe(
      map((value) => !value),
      catchError(() => of(false))
    );
  }

  createStatus(payload: Status): Observable<Status> {
    return this.http.post<BaseResponse<Status>>(`${ACCOUNT_API_PATH}/states`, payload).pipe(
      map((res) => res.data),
      tap((data) => this.actions.dispatch(upsertStatus({ data })))
    );
  }

  updateStatus(payload: Status): Observable<unknown> {
    return this.http.put<BaseResponse<unknown>>(`${ACCOUNT_API_PATH}/states/${payload.id}`, payload).pipe(
      map((res) => res.data),
      tap(() => this.actions.dispatch(upsertStatus({ data: payload })))
    );
  }

  getConditionTypes(): Observable<TransitionOption<ConditionType>[]> {
    return this.http
      .get<TransitionOption<ConditionType>[]>(`${ACCOUNT_API_PATH}/conditions/types`)
      .pipe(catchError(() => of([])));
  }

  getValidatorTypes(): Observable<TransitionOption<ValidatorType>[]> {
    return this.http
      .get<TransitionOption<ValidatorType>[]>(`${ACCOUNT_API_PATH}/validators/types`)
      .pipe(catchError(() => of([])));
  }

  getPostFunctionTypes(): Observable<TransitionOption<PostFunctionType>[]> {
    return this.http.get<TransitionOption<PostFunctionType>[]>(`${ACCOUNT_API_PATH}/pfs/types`);
  }

  getUsers(searchQuery: string): Observable<BaseObject[]> {
    return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  getPermissions(searchQuery: string): Observable<BaseObject[]> {
    return this.http
      .get<BaseObject[]>(`${ACCOUNT_API_PATH}/permissions/search?name=${searchQuery}`)
      .pipe(catchError(() => of([])));
  }

  getTemplateVariables(): Observable<TemplateVariableModel[]> {
    return this.http
      .get<BaseResponse<TemplateVariableModel[]>>(`${ACCOUNT_API_PATH}/temp-variables`)
      .pipe(map((res) => res.data));
  }

  getEmailTemplates(params: HttpParams): Observable<Pagination<EmailTemplate>> {
    return this.http
      .get<PagingResponse<EmailTemplate>>(`${ACCOUNT_API_PATH}/templates`, { params })
      .pipe(map((res) => res.data));
  }

  getEmailTemplate(id: string): Observable<EmailTemplate> {
    return this.http
      .get<BaseResponse<EmailTemplate>>(`${ACCOUNT_API_PATH}/templates/${id}`)
      .pipe(map((res) => res.data));
  }

  createEmailTemplate(payload: EmailTemplate): Observable<BaseResponse<EmailTemplate>> {
    return this.http
      .post<BaseResponse<EmailTemplate>>(`${ACCOUNT_API_PATH}/template`, payload)
      .pipe(tap(({ data }) => this.actions.dispatch(upsertEmailTemplate({ data }))));
  }

  updateEmailTemplate(payload: EmailTemplate): Observable<BaseResponse<EmailTemplate>> {
    return this.http
      .put<BaseResponse<EmailTemplate>>(`${ACCOUNT_API_PATH}/template/${payload.id}`, payload)
      .pipe(tap(({ data }) => this.actions.dispatch(upsertEmailTemplate({ data }))));
  }

  deleteEmailTemplate(id: string): Observable<unknown> {
    return this.http
      .delete(`${ACCOUNT_API_PATH}/template/${id}`)
      .pipe(tap(() => this.actions.dispatch(removeEmailTemplate({ id }))));
  }

  getAllEmailTemplates(): Observable<EmailTemplate[]> {
    return this.http
      .get<BaseResponse<EmailTemplate[]>>(`${ACCOUNT_API_PATH}/template-list`)
      .pipe(map((res) => res.data));
  }

  checkEmailTemplateName(payload: Pick<EmailTemplate, 'name'>): Observable<boolean> {
    return this.http.post<boolean>(`${ACCOUNT_API_PATH}/template/check-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
