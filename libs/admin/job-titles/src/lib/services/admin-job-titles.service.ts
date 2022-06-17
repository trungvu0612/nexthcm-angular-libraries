import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, JobTitle, JobTitlesService } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminJobTitlesService {
  constructor(private readonly http: HttpClient, private readonly jobTitlesService: JobTitlesService) {}

  upsertJobLevel(payload: JobTitle): Observable<unknown> {
    return (payload.id ? this.jobTitlesService.updateJobTitle(payload) : this.createJobTitle(payload)).pipe(
      tap(() => this.jobTitlesService.doRefreshJobTitles())
    );
  }

  createJobTitle(payload: JobTitle): Observable<JobTitle> {
    return this.http.post<JobTitle>(`${ACCOUNT_API_PATH}/titles`, payload);
  }

  deleteJobTitle(id: string): Observable<JobTitle> {
    return this.http
      .delete<JobTitle>(`${ACCOUNT_API_PATH}/titles/${id}`)
      .pipe(tap(() => this.jobTitlesService.doRefreshJobTitles()));
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http
      .get(`${ACCOUNT_API_PATH}/titles/check-existing`, { params: new HttpParams().set('name', name) })
      .pipe(
        mapTo(true),
        catchError(() => of(false))
      );
  }
}
