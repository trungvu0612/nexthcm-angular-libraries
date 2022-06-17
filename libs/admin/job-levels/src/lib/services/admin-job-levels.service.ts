import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, JobLevelsService, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';

import { JobLevel } from '../models/job-level';

@Injectable({
  providedIn: 'root',
})
export class AdminJobLevelsService {
  constructor(private readonly http: HttpClient, private readonly jobLevelsService: JobLevelsService) {}

  getJobLevels(params: HttpParams): Observable<Pagination<JobLevel>> {
    return this.http
      .get<PagingResponse<JobLevel>>(`${ACCOUNT_API_PATH}/levels`, { params })
      .pipe(map((res) => res.data));
  }

  upsertJobLevel(payload: JobLevel): Observable<unknown> {
    return (payload.id ? this.editJobLevel(payload) : this.createJobLevel(payload)).pipe(
      tap(() => this.jobLevelsService.doRefreshJobLevels())
    );
  }

  createJobLevel(payload: JobLevel): Observable<unknown> {
    return this.http.post<unknown>(`${ACCOUNT_API_PATH}/levels`, payload);
  }

  editJobLevel(payload: JobLevel): Observable<unknown> {
    return this.http.put<unknown>(`${ACCOUNT_API_PATH}/levels/${payload.id}`, payload);
  }

  deleteJobLevel(id: string): Observable<unknown> {
    return this.http
      .delete(`${ACCOUNT_API_PATH}/levels/${id}`)
      .pipe(tap(() => this.jobLevelsService.doRefreshJobLevels()));
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http
      .get(`${ACCOUNT_API_PATH}/levels/checking-exist`, { params: new HttpParams().set('name', name) })
      .pipe(
        mapTo(true),
        catchError(() => of(false))
      );
  }
}
