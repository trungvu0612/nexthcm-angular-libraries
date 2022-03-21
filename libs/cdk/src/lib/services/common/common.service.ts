import { getLocaleMonthNames } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseOption, BaseResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  readonly localeMonths$: Observable<BaseOption<number>[]> = this.translocoService.langChanges$.pipe(
    map((lang) => getLocaleMonthNames(lang, 1, 2).map((month, index) => ({ label: month, value: index })))
  );

  constructor(private readonly http: HttpClient, private readonly translocoService: TranslocoService) {}

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
