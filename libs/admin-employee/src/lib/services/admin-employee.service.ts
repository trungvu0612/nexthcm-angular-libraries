import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { SearchEmployee, EmployeeData } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class AdminEmployeeService {
  appVersion = this.env.apiUrl + '/accountapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getEmployee(
    pageIndex: number,
    pageSize: number,
    search: SearchEmployee
  ): Observable<PagingResponse<EmployeeData>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchEmployee]);
    });
    return this.httpClient.get<PagingResponse<EmployeeData>>(
      this.appVersion + '/users?assigned=true',
      {
        params: httpParams
          .set('page', pageIndex ? pageIndex.toString() : '')
          .set('size', pageSize ? pageSize.toString() : ''),
      }
    );
  }

  getUserById(userId: string): Observable<EmployeeData> {
    return this.httpClient.get<EmployeeData>(this.appVersion + `/users/${userId}`, {});
  }

  createEmployee(dto: EmployeeData): Observable<EmployeeData> {
    return this.httpClient.post<EmployeeData>(this.appVersion + '/users', dto);
  }

  editEmployee(dto: EmployeeData, id: string): Observable<EmployeeData> {
    return this.httpClient.put<EmployeeData>(this.appVersion + `/users/${id}`, dto);
  }
  getUserRoles(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/roles`, {});
  }

  deleteEmployee(userId: string | undefined): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/users/${userId}`, {});
  }
}
