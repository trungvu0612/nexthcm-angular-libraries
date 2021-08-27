import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseObject, BaseResponse, EmployeeInfo, Pagination, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeGeneralInformation, EmployeeInformationType } from '../models';

interface AdminEmployeeState {
  organizations: BaseObject[];
  roles: BaseObject[];
  jobTitles: BaseObject[];
  jobLevels: BaseObject[];
  users: BaseObject[];
  offices: BaseObject[];
}

@Injectable()
export class AdminEmployeeService extends RxState<AdminEmployeeState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('organizations', this.getOrganizations().pipe(map((res) => res.data.items)));
    this.connect('roles', this.getRoles().pipe(map((res) => res.data.items)));
    this.connect('jobTitles', this.getJobTitles());
    this.connect('jobLevels', this.getJobLevels().pipe(map((res) => res.data.items)));
    this.connect('users', this.getUsers().pipe(map((res) => res.data.items)));
    this.connect('offices', this.getOffices().pipe(map((res) => res.data.items)));
  }

  getEmployees(params: HttpParams): Observable<Pagination<EmployeeInfo>> {
    return this.http
      .get<PagingResponse<EmployeeInfo>>(`${ACCOUNT_API_PATH}/employees`, { params })
      .pipe(map((res) => res.data));
  }

  initEmployee(payload: EmployeeGeneralInformation): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees`, payload);
  }

  removeEmployee(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${ACCOUNT_API_PATH}/employees/${id}`);
  }

  getOrganizations(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/orgs/v2`);
  }

  getJobTitles(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/titles/v2`);
  }

  getRoles(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/roles/v2`);
  }

  getUsers(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/users/v2`);
  }

  getJobLevels(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/levels/v2`);
  }

  getOffices(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/offices/v2`);
  }

  getEmployeeGeneralInformation(id: string): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.get<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees/${id}`);
  }

  updateEmployeeGeneralInformation(
    payload: EmployeeGeneralInformation
  ): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees`, payload);
  }

  getEmployeeInformation<T>(id: string, apiType: EmployeeInformationType): Observable<BaseResponse<T>> {
    return this.http.get<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees/${apiType}/${id}`);
  }

  updateEmployeeInformation<T>(payload: T): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees`, payload);
  }
}
