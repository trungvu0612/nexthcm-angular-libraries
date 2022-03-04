import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private readonly http: HttpClient) {}

  getCronNextRunTime(cron: string): Observable<number | null> {
    return this.http
      .post<BaseResponse<number>>(`${ACCOUNT_API_PATH}/schedulers/cron`, {
        cron,
        timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .pipe(
        map((res) => res.data),
        catchError(() => of(null))
      );
  }
}
