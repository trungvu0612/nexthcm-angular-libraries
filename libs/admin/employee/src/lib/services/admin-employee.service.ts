import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country';
import { JobLevel } from '../models/job-level';
import { JobTitle } from '../models/job-title';
import { Language } from '../models/language';
import { Office } from '../models/office';
import { Org } from '../models/org';
import { Permission } from '../models/permission';
import { SearchEmployee, User } from '../models/user';
import { UserGroup } from '../models/user-group';
import { UserRole } from '../models/user-role';

@Injectable({
  providedIn: 'root',
})
export class AdminEmployeeService {
  appVersion = '/accountapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getEmployee(pageIndex: number, pageSize: number, search: SearchEmployee): Observable<PagingResponse<User>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchEmployee]);
    });
    return this.httpClient.get<PagingResponse<User>>(this.appVersion + '/users', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(this.appVersion + `/users/${userId}`);
  }

  createEmployee(dto: User): Observable<User> {
    return this.httpClient.post<User>(this.appVersion + '/users', dto);
  }

  editEmployee(dto: User, id: string): Observable<User> {
    return this.httpClient.put<User>(this.appVersion + `/users/${id}`, dto);
  }

  getUserRoles(): Observable<PagingResponse<UserRole>> {
    return this.httpClient.get<PagingResponse<UserRole>>(this.appVersion + `/roles`);
  }

  getPermissions(): Observable<PagingResponse<Permission>> {
    return this.httpClient.get<PagingResponse<Permission>>(this.appVersion + `/permissions`);
  }

  getCountries(): Observable<PagingResponse<Country>> {
    return this.httpClient.get<PagingResponse<Country>>(this.appVersion + `/countries`);
  }

  getLanguages(): Observable<PagingResponse<Language>> {
    return this.httpClient.get<PagingResponse<Language>>(this.appVersion + `/languages`);
  }

  getUserGroups(): Observable<PagingResponse<UserGroup>> {
    return this.httpClient.get<PagingResponse<UserGroup>>(this.appVersion + `/user-groups`);
  }

  getAllUsers(): Observable<PagingResponse<User>> {
    return this.httpClient.get<PagingResponse<User>>(this.appVersion + `/users`);
  }

  getJobTitle(): Observable<PagingResponse<JobTitle>> {
    return this.httpClient.get<PagingResponse<JobTitle>>(this.appVersion + `/titles`);
  }

  getJobLevels(): Observable<PagingResponse<JobLevel>> {
    return this.httpClient.get<PagingResponse<JobLevel>>(this.appVersion + `/levels`);
  }

  getOrg(): Observable<PagingResponse<Org>> {
    return this.httpClient.get<PagingResponse<Org>>(this.appVersion + `/orgs?orgType=DEP`);
  }

  getOffices(): Observable<PagingResponse<Office>> {
    return this.httpClient.get<PagingResponse<Office>>(this.appVersion + `/offices`);
  }

  deleteEmployee(userId: string): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/users/${userId}`);
  }
}
