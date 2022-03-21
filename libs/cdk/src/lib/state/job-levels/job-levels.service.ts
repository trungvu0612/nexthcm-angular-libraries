import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, PagingResponse } from '../../models';

interface JobLevelsState {
  jobLevels: BaseObject[];
}

@Injectable({
  providedIn: 'root',
})
export class JobLevelsService extends RxState<JobLevelsState> {
  readonly jobLevels$ = this.select('jobLevels');
  private readonly loadJobLevels$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('jobLevels', this.loadJobLevels$.pipe(switchMap(() => this.getJobLevels())));
  }

  getJobLevels(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/levels/v2`, { params: { size: 999 } }).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }

  doLoadJobLevels(): void {
    if (!this.get('jobLevels')) {
      this.loadJobLevels$.next();
    }
  }

  doRefreshJobLevels(): void {
    if (this.get('jobLevels')) {
      this.loadJobLevels$.next();
    }
  }
}
