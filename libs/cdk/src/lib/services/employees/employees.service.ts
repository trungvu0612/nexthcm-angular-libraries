import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import {
  BaseObject,
  BaseResponse,
  BaseUser,
  EmployeeAttachment,
  EmployeeDuration,
  EmployeeEducation,
  EmployeeExperience,
  EmployeeGeneralInformation,
  EmployeeIndividual,
  EmployeeInformationAPIType,
  EmployeeInformationType,
  EmployeeSHUI,
} from '../../models';
import { parseJsonStringFields } from '../../utils';

interface EmployeesState {
  supervisorTypes: BaseObject[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeesService extends RxState<EmployeesState> {
  readonly supervisorTypes$ = this.select('supervisorTypes');
  private readonly loadSupervisorTypes$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('supervisorTypes', this.loadSupervisorTypes$.pipe(switchMap(() => this.getSupervisorTypes())));
  }

  searchEmployees(searchQuery: string, tenantId?: string): Observable<BaseUser[]> {
    let params = new HttpParams().set('search', searchQuery);

    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }
    return this.http.get<BaseResponse<BaseUser[]>>(`${ACCOUNT_API_PATH}/users/v2`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  getEmployeeGeneralInformation(id: string): Observable<EmployeeGeneralInformation> {
    return this.http
      .get<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees/${id}`)
      .pipe(map((res) => res.data));
  }

  getEmployeeInformation(employeeId: string, type: 'INDIVIDUAL'): Observable<EmployeeIndividual>;
  getEmployeeInformation(employeeId: string, type: 'DURATION'): Observable<EmployeeDuration>;
  getEmployeeInformation(employeeId: string, type: 'EDUCATION'): Observable<EmployeeEducation>;
  getEmployeeInformation(employeeId: string, type: 'WORK_EXPERIENCE'): Observable<EmployeeExperience>;
  getEmployeeInformation(employeeId: string, type: 'SHUI'): Observable<EmployeeSHUI>;
  getEmployeeInformation(employeeId: string, type: 'ATTACHMENT'): Observable<EmployeeAttachment>;
  getEmployeeInformation<T extends EmployeeInformationType>(
    employeeId: string,
    type: EmployeeInformationAPIType
  ): Observable<T> {
    return this.http
      .get<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees/${type.toLowerCase()}/${employeeId}`)
      .pipe(
        map((res) =>
          parseJsonStringFields(res.data, [
            'office',
            'bankAccounts',
            'probationDate',
            'emergencyContacts',
            'healthCares',
            'permanentAddress',
            'temporaryAddress',
            'attachmentFiles',
            'dependenceMembers',
            'certificates',
            'experience',
          ])
        ),
        catchError(() => of({} as T)),
        map((res) => ({ ...res, employeeId, type }))
      );
  }

  getPersonalAccessToken(): Observable<string> {
    return this.http.get(`${ACCOUNT_API_PATH}/personal-access-token`, { responseType: 'text' });
  }

  getSupervisorTypes(): Observable<BaseObject[]> {
    return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/reporting`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  doLoadSupervisorTypes(): void {
    if (!this.get('supervisorTypes')) {
      this.loadSupervisorTypes$.next();
    }
  }

  getDirectSupervisor(employeeId: string): Observable<BaseUser> {
    return this.http.get<BaseResponse<BaseUser>>(`${ACCOUNT_API_PATH}/users/direct_report/${employeeId}`).pipe(
      map((res) => res.data),
      catchError(() => EMPTY)
    );
  }

  updateEmployeeGeneralInformation(
    payload: EmployeeGeneralInformation
  ): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees`, payload);
  }
}
