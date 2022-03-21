import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, JobTitle, Pagination, PagingResponse } from '../../models';

interface JobTitlesState {
  jobTitles: BaseObject[];
}

@Injectable({
  providedIn: 'root',
})
export class JobTitlesService extends RxState<JobTitlesState> {
  readonly loadJobTitles$ = new Subject<void>();
  readonly jobTitles$ = this.select('jobTitles');

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('jobTitles', this.loadJobTitles$.pipe(switchMap(() => this.getBaseJobTitles())));
  }

  getBaseJobTitles(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/titles/v2`).pipe(catchError(() => of([])));
  }

  doLoadJobTitles(): void {
    if (!this.get('jobTitles')) {
      this.loadJobTitles$.next();
    }
  }

  doRefreshJobTitles(): void {
    if (this.get('jobTitles')) {
      this.loadJobTitles$.next();
    }
  }

  searchJobTitles(searchQuery: string): Observable<BaseObject[]> {
    return this.jobTitles$.pipe(
      map((jobTitles) =>
        jobTitles.filter((jobTitle) => jobTitle.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
      )
    );
  }

  getJobTitles(params: HttpParams): Observable<Pagination<JobTitle>> {
    return this.http
      .get<PagingResponse<JobTitle>>(`${ACCOUNT_API_PATH}/titles`, { params })
      .pipe(map((res) => res.data));
  }

  updateJobTitle(payload: Partial<JobTitle>): Observable<JobTitle> {
    return this.http.put<JobTitle>(`${ACCOUNT_API_PATH}/titles/${payload.id}`, payload);
  }
}
