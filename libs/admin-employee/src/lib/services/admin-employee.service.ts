import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { EmployeeData, SearchEmployee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class AdminEmployeeService {
  appVersion = '/accountapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getEmployee(pageIndex: number, pageSize: number, search: SearchEmployee): Observable<PagingResponse<EmployeeData>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchEmployee]);
    });
    return this.httpClient.get<PagingResponse<EmployeeData>>(this.appVersion + '/users', {
      params: httpParams
        .set('assigned', 'true')
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
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

  getPermissions(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/permissions`, {});
  }

  getCountries(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/countries`, {});
  }

  getLanguages(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/languages`, {});
  }

  getUserGroups(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/user-groups`, {});
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/users?assigned=true`, {});
  }

  getJobTitle(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/titles`, {});
  }

  getJobLevels(): Observable<any> {
    return this.httpClient.get(this.appVersion + `/levels`, {});
  }

  deleteEmployee(userId: string | undefined): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/users/${userId}`, {});
  }
}
