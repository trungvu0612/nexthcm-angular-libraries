import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { JobTitle } from '../models/job-title';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminJobTitlesService {
  constructor(private http: HttpClient) {}

  getAdminJobTitles(params: HttpParams): Observable<PagingResponse<JobTitle>> {
    return this.http.get<PagingResponse<JobTitle>>(`${MY_ACCOUNT_PATH}/titles/`, { params });
  }

  createAdminJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http.post<JobTitle>(`${MY_ACCOUNT_PATH}/titles`, payload);
  }

  updateAdminJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http.put<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${payload.id}`, payload);
  }

  deleteAdminJobTitle(id: string): Observable<JobTitle> {
    return this.http.delete<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${id}`);
  }
}
