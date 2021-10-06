import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { ACCOUNT_API_PATH, Pagination, PagingResponse, refreshJobTitles } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { JobTitle } from '../models/job-title';

@Injectable()
export class AdminJobTitlesService {
  constructor(private readonly http: HttpClient, private readonly actions: Actions) {}

  getJobTitles(params: HttpParams): Observable<Pagination<JobTitle>> {
    return this.http.get<PagingResponse<JobTitle>>(`${ACCOUNT_API_PATH}/titles/`, { params }).pipe(map(res => res.data));
  }

  upsertJobLevel(payload: JobTitle): Observable<unknown> {
    return payload.id ? this.updateJobTitle(payload) : this.createJobTitle(payload);
  }

  createJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http
      .post<JobTitle>(`${ACCOUNT_API_PATH}/titles`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }

  updateJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http
      .put<JobTitle>(`${ACCOUNT_API_PATH}/titles/${payload.id}`, payload)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }

  deleteJobTitle(id: string): Observable<JobTitle> {
    return this.http
      .delete<JobTitle>(`${ACCOUNT_API_PATH}/titles/${id}`)
      .pipe(tap(() => this.actions.dispatch(refreshJobTitles())));
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get(`${ACCOUNT_API_PATH}/titles/check-existing?name=${name}`).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
