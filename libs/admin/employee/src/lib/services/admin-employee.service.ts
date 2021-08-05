import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseObject, BaseResponse, EmployeeInfo, PagingResponse } from '@nexthcm/cdk';
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

const ADMIN_EMPLOYEE_PATH = '/accountapp/v1.0';

@Injectable()
export class AdminEmployeeService extends RxState<AdminEmployeeState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('organizations', this.getOrganizations().pipe(map((res) => res.data.items)));
    this.connect('roles', this.getRoles().pipe(map((res) => res.data.items)));
    this.connect('jobTitles', this.getJobTitles().pipe(map((res) => res.data.items)));
    this.connect('jobLevels', this.getJobLevels().pipe(map((res) => res.data.items)));
    this.connect('users', this.getUsers().pipe(map((res) => res.data.items)));
    this.connect('offices', this.getOffices().pipe(map((res) => res.data.items)));
  }

  getEmployees(params: HttpParams): Observable<PagingResponse<EmployeeInfo>> {
    return this.http.get<PagingResponse<EmployeeInfo>>(`${ADMIN_EMPLOYEE_PATH}/employees`, { params });
  }

  initEmployee(payload: EmployeeGeneralInformation): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ADMIN_EMPLOYEE_PATH}/employees`, payload);
  }

  removeEmployee(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${ADMIN_EMPLOYEE_PATH}/employees/${id}`);
  }

  getOrganizations(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/orgs/v2`);
  }

  getJobTitles(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/titles/v2`);
  }

  getRoles(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/roles/v2`);
  }

  getUsers(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/users/v2`);
  }

  getJobLevels(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/levels/v2`);
  }

  getOffices(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ADMIN_EMPLOYEE_PATH}/offices/v2`);
  }

  getEmployeeGeneralInformation(id: string): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.get<BaseResponse<EmployeeGeneralInformation>>(`${ADMIN_EMPLOYEE_PATH}/employees/${id}`);
  }

  updateEmployeeGeneralInformation(
    payload: EmployeeGeneralInformation
  ): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ADMIN_EMPLOYEE_PATH}/employees`, payload);
  }

  getEmployeeInformation<T>(id: string, apiType: EmployeeInformationType): Observable<BaseResponse<T>> {
    return this.http.get<BaseResponse<T>>(`${ADMIN_EMPLOYEE_PATH}/info/employees/${apiType}/${id}`);
  }

  updateEmployeeInformation<T>(payload: T): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${ADMIN_EMPLOYEE_PATH}/info/employees`, payload);
  }
}
