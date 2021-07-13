import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobTitle } from '../models/job-title';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminJobTitlesService {
  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private http: HttpClient) {}

  getAdminJobTitles(pageIndex: number, pageSize: number): Observable<PagingResponse<JobTitle>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<JobTitle>>(`${MY_ACCOUNT_PATH}/titles`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminJobTitleId(id: JobTitle | string): Observable<JobTitle> {
    if (id === undefined || id === '') {
      return this.http.get<JobTitle>(this.env.apiUrl + `${MY_ACCOUNT_PATH}/titles/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<JobTitle>(this.env.apiUrl + `${MY_ACCOUNT_PATH}/titles/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createAdminJobTitleId(body: any): Observable<JobTitle> {
    return this.http.post<JobTitle>(`${MY_ACCOUNT_PATH}/titles`, body);
  }

  editAdminJobTitleId(id: string | undefined, body: any): Observable<JobTitle> {
    return this.http.put<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${id}`, body);
  }

  deleteAdminJobTitleId(id: string): Observable<JobTitle> {
    return this.http.delete<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${id}`);
  }
}
