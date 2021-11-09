import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ACCOUNT_API_PATH } from '../../constants';
import {
  BaseResponse,
  BaseUser,
  EmployeeAttachment,
  EmployeeDuration,
  EmployeeEducation,
  EmployeeGeneralInformation,
  EmployeeIndividual,
  EmployeeInformationAPIType,
  EmployeeInformationType,
  EmployeeSHUI,
} from '../../models';
import { parseJsonStringFields } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private readonly http: HttpClient) {}

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
          ])
        ),
        catchError(() => of({} as T)),
        map((res) => ({ ...res, employeeId, type }))
      );
  }
}
