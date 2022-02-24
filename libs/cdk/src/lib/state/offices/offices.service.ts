import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, PagingResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class OfficesService {
  constructor(private readonly http: HttpClient) {}

  getOffices(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/offices/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }

  getOnsiteOffices(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/office/onsite`).pipe(catchError(() => of([])));
  }
}
