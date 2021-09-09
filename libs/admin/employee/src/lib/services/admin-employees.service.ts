import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseObject,
  BaseResponse,
  EmployeeGeneralInformation,
  EmployeeInfo,
  Pagination,
  PagingResponse,
} from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AdminEmployeesState {
  organizations: BaseObject[];
  roles: BaseObject[];
  jobTitles: BaseObject[];
  jobLevels: BaseObject[];
  offices: BaseObject[];
}

@Injectable()
export class AdminEmployeesService extends RxState<AdminEmployeesState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('organizations', this.getOrganizations().pipe(map((res) => res.data.items)));
    this.connect('roles', this.getRoles().pipe(map((res) => res.data.items)));
    this.connect('jobTitles', this.getJobTitles());
    this.connect('jobLevels', this.getJobLevels().pipe(map((res) => res.data.items)));
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

  getJobLevels(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/levels/v2`);
  }

  getOffices(): Observable<PagingResponse<BaseObject>> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/offices/v2`);
  }

  updateEmployeeGeneralInformation(
    payload: EmployeeGeneralInformation
  ): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees`, payload);
  }

  updateEmployeeInformation<T>(payload: T): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees`, payload);
  }
}
