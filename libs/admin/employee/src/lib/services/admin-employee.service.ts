import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseEmployee, BaseItem, EmployeeGeneralInformation, EmployeeInformationType } from '../models';

interface AdminEmployeeState {
  organizations: BaseItem[];
  roles: BaseItem[];
  jobTitles: BaseItem[];
  jobLevels: BaseItem[];
  users: BaseItem[];
  offices: BaseItem[];
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

  getEmployees(params: HttpParams): Observable<PagingResponse<BaseEmployee>> {
    return this.http.get<PagingResponse<BaseEmployee>>(`${ADMIN_EMPLOYEE_PATH}/employees`, { params });
  }

  initEmployee(payload: EmployeeGeneralInformation): Observable<BaseResponse<BaseEmployee>> {
    return this.http.post<BaseResponse<BaseEmployee>>(`${ADMIN_EMPLOYEE_PATH}/employees`, payload);
  }

  removeEmployee(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${ADMIN_EMPLOYEE_PATH}/employees/${id}`);
  }

  getOrganizations(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/orgs/v2`);
  }

  getJobTitles(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/titles/v2`);
  }

  getRoles(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/roles/v2`);
  }

  getUsers(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/users/v2`);
  }

  getJobLevels(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/levels/v2`);
  }

  getOffices(): Observable<PagingResponse<BaseItem>> {
    return this.http.get<PagingResponse<BaseItem>>(`${ADMIN_EMPLOYEE_PATH}/offices/v2`);
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

  updateEmployeeInformation(payload: any): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${ADMIN_EMPLOYEE_PATH}/info/employees`, payload);
  }
}
