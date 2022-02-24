import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, PagingResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class JobLevelsService {
  constructor(private readonly http: HttpClient) {}

  getJobLevels(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/levels/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }
}
