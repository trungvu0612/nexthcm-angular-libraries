import { HttpClient } from '@angular/common/http';
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

  searchEmployees(searchQuery: string): Observable<BaseUser[]> {
    return this.http.get<BaseResponse<BaseUser[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  getEmployeeGeneralInformation(id: string): Observable<EmployeeGeneralInformation> {
    return this.http
      .get<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees/${id}`)
      .pipe(map((res) => res.data));
  }

  getEmployeeInformation(id: string, apiType: 'INDIVIDUAL'): Observable<EmployeeIndividual>;
  getEmployeeInformation(id: string, apiType: 'DURATION'): Observable<EmployeeDuration>;
  getEmployeeInformation(id: string, apiType: 'EDUCATION'): Observable<EmployeeEducation>;
  getEmployeeInformation(id: string, apiType: 'SHUI'): Observable<EmployeeSHUI>;
  getEmployeeInformation(id: string, apiType: 'ATTACHMENT'): Observable<EmployeeAttachment>;
  getEmployeeInformation<T extends EmployeeInformationType>(
    id: string,
    apiType: EmployeeInformationAPIType
  ): Observable<T> {
    return this.http
      .get<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees/${apiType.toLowerCase()}/${id}`)
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
          ])
        )
      );
  }
}
