import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { Pagination, PagingResponse, refreshJobTitles } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JobTitle } from '../models/job-title';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable()
export class AdminJobTitlesService {
  constructor(private http: HttpClient, private readonly actions: Actions) {}

  getAdminJobTitles(params: HttpParams): Observable<Pagination<JobTitle>> {
    return this.http.get<PagingResponse<JobTitle>>(`${MY_ACCOUNT_PATH}/titles/`, { params }).pipe(map(res => res.data));
  }

  createAdminJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http
      .post<JobTitle>(`${MY_ACCOUNT_PATH}/titles`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }

  updateAdminJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http
      .put<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${payload.id}`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }

  deleteAdminJobTitle(id: string): Observable<JobTitle> {
    return this.http
      .delete<JobTitle>(`${MY_ACCOUNT_PATH}/titles/${id}`)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }
}
