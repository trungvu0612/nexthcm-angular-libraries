import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseObject,
  BaseResponse,
  EmailVariable,
  MY_TIME_API_PATH,
  Pagination,
  PagingResponse,
  PromptService,
  WorkflowsService,
  WorkflowStatusType,
} from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { ConditionType, PostFunctionType, ValidatorType } from '../enums';
import { EmailTemplate, InitWorkflow, Status, TransitionOption, Workflow } from '../models';

interface AdminWorkflowsState {
  statusTypes: WorkflowStatusType[];
  statuses: Status[];
  conditionTypes: TransitionOption<ConditionType>[];
  validatorTypes: TransitionOption<ValidatorType>[];
  postFunctionTypes: TransitionOption<PostFunctionType>[];
  emailTemplates: EmailTemplate[];
  emailVariables: EmailVariable[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminWorkflowsService extends RxState<AdminWorkflowsState> {
  readonly statusTypes$ = this.select('statusTypes');
  readonly statuses$ = this.select('statuses');
  readonly conditionTypes$ = this.select('conditionTypes');
  readonly validatorTypes$ = this.select('validatorTypes');
  readonly postFunctionTypes$ = this.select('postFunctionTypes');
  readonly emailTemplates$ = this.select('emailTemplates');
  readonly emailVariables$ = this.select('emailVariables');

  private readonly loadStatusTypes$ = new Subject<void>();
  private readonly loadStatuses$ = new Subject<void>();
  private readonly loadConditionTypes$ = new Subject<void>();
  private readonly loadValidatorTypes$ = new Subject<void>();
  private readonly loadPostFunctionTypes$ = new Subject<void>();
  private readonly loadEmailTemplates$ = new Subject<void>();
  private readonly loadEmailVariables$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly promptService: PromptService,
    private readonly workflowsService: WorkflowsService
  ) {
    super();
    this.connect('conditionTypes', this.loadConditionTypes$.pipe(switchMap(() => this.getConditionTypes())));
    this.connect('validatorTypes', this.loadValidatorTypes$.pipe(switchMap(() => this.getValidatorTypes())));
    this.connect('postFunctionTypes', this.loadPostFunctionTypes$.pipe(switchMap(() => this.getPostFunctionTypes())));
    this.connect('statusTypes', this.loadStatusTypes$.pipe(switchMap(() => this.getStatusTypes())));
    this.connect('statuses', this.loadStatuses$.pipe(switchMap(() => this.getStatuses())));
    this.connect('emailTemplates', this.loadEmailTemplates$.pipe(switchMap(() => this.getAllEmailTemplates())));
    this.connect('emailVariables', this.loadEmailVariables$.pipe(switchMap(() => this.getTemplateVariables())));
  }

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

  upsertWorkflow(workflowId: string, payload: Workflow): Observable<unknown> {
    return this.http.put<unknown>(`${ACCOUNT_API_PATH}/process/${workflowId}`, payload).pipe(
      tap(
        this.promptService.handleResponse('WORKFLOW.updateWorkflowSuccessfully', () =>
          this.workflowsService.doRefreshWorkflows()
        )
      ),
      catchError(() => EMPTY)
    );
  }

  initWorkflow(payload: InitWorkflow): Observable<BaseResponse<Workflow>> {
    return this.http
      .post<BaseResponse<Workflow>>(`${ACCOUNT_API_PATH}/process/init`, payload)
      .pipe(tap(() => this.workflowsService.doRefreshWorkflows()));
  }

  deleteWorkflow(workflowId: string): Observable<unknown> {
    return this.http
      .delete<unknown>(`${ACCOUNT_API_PATH}/process/${workflowId}`)
      .pipe(tap(() => this.workflowsService.doRefreshWorkflows()));
  }

  getStatuses(): Observable<Status[]> {
    return this.http.get<BaseResponse<Status[]>>(`${ACCOUNT_API_PATH}/states`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
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
      tap(() => this.doRefreshStatuses())
    );
  }

  updateStatus(payload: Status): Observable<unknown> {
    return this.http.put<BaseResponse<unknown>>(`${ACCOUNT_API_PATH}/states/${payload.id}`, payload).pipe(
      map((res) => res.data),
      tap(() => this.doRefreshStatuses())
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

  getPermissions(searchQuery: string): Observable<string[]> {
    return this.http
      .get<string[]>(`${ACCOUNT_API_PATH}/permissions/search`, { params: new HttpParams().set('name', searchQuery) })
      .pipe(catchError(() => of([])));
  }

  getTemplateVariables(): Observable<EmailVariable[]> {
    return this.http
      .get<BaseResponse<EmailVariable[]>>(`${ACCOUNT_API_PATH}/temp-variables`)
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
      .pipe(tap(() => this.doRefreshEmailTemplates()));
  }

  updateEmailTemplate(payload: EmailTemplate): Observable<BaseResponse<EmailTemplate>> {
    return this.http
      .put<BaseResponse<EmailTemplate>>(`${ACCOUNT_API_PATH}/template/${payload.id}`, payload)
      .pipe(tap(() => this.doRefreshEmailTemplates()));
  }

  deleteEmailTemplate(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/template/${id}`).pipe(tap(() => this.doRefreshEmailTemplates()));
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

  checkWorkflowInUse(workflowId: string): Observable<boolean> {
    return this.http
      .get<BaseResponse<boolean>>(`${MY_TIME_API_PATH}/wf/check-before-delete/${workflowId}`)
      .pipe(map((res) => res.data));
  }

  doLoadConditionTypes(): void {
    if (!this.get('conditionTypes')) {
      this.loadConditionTypes$.next();
    }
  }

  doLoadValidatorTypes(): void {
    if (!this.get('validatorTypes')) {
      this.loadValidatorTypes$.next();
    }
  }

  doLoadPostFunctionTypes(): void {
    if (!this.get('postFunctionTypes')) {
      this.loadPostFunctionTypes$.next();
    }
  }

  doLoadStatusTypes(): void {
    if (!this.get('statusTypes')) {
      this.loadStatusTypes$.next();
    }
  }

  doLoadStatuses(): void {
    if (!this.get('statuses')) {
      this.loadStatuses$.next();
    }
  }

  doRefreshStatuses(): void {
    if (this.get('statuses')) {
      this.loadStatuses$.next();
    }
  }

  doLoadEmailTemplates(): void {
    if (!this.get('emailTemplates')) {
      this.loadEmailTemplates$.next();
    }
  }

  doRefreshEmailTemplates(): void {
    if (this.get('emailTemplates')) {
      this.loadEmailTemplates$.next();
    }
  }

  doLoadEmailVariables(): void {
    if (!this.get('emailVariables')) {
      this.loadEmailVariables$.next();
    }
  }
}
