import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseResponse,
  DEFAULT_PAGINATION_DATA,
  EmployeeGeneralInformation,
  EmployeeInfo,
  Pagination,
  PagingResponse,
} from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AdminEmployeesService {
  constructor(private readonly http: HttpClient) {}

  getEmployees(params: HttpParams): Observable<Pagination<EmployeeInfo>> {
    return this.http.get<PagingResponse<EmployeeInfo>>(`${ACCOUNT_API_PATH}/employees`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of(DEFAULT_PAGINATION_DATA))
    );
  }

  initEmployee(payload: EmployeeGeneralInformation): Observable<BaseResponse<EmployeeGeneralInformation>> {
    return this.http.post<BaseResponse<EmployeeGeneralInformation>>(`${ACCOUNT_API_PATH}/employees`, payload);
  }

  removeEmployee(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/employees/${id}`);
  }

  updateEmployeeInformation<T>(payload: T): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${ACCOUNT_API_PATH}/info/employees`, payload);
  }

  checkCircularDirectReports(employeeId: string, directReportId: string): Observable<{ isCircular: boolean }> {
    return this.http
      .get<BaseResponse<{ isCircular: boolean }>>(
        `${ACCOUNT_API_PATH}/employees/check_direct_report?employeeId=${employeeId}&directId=${directReportId}`
      )
      .pipe(map((res) => res.data));
  }
}
