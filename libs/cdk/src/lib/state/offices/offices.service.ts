import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH, DEFAULT_PAGINATION_DATA } from '../../constants';
import { BaseObject, Office, Pagination, PagingResponse } from '../../models';

interface OfficesState {
  offices: BaseObject[];
  onsiteOffices: BaseObject[];
}

@Injectable({
  providedIn: 'root',
})
export class OfficesService extends RxState<OfficesState> {
  readonly offices$ = this.select('offices');
  readonly onsiteOffices$ = this.select('onsiteOffices');
  private readonly loadOffices$ = new Subject<void>();
  private readonly loadOnsiteOffices$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('offices', this.loadOffices$.pipe(switchMap(() => this.getBaseOffices())));
    this.connect('onsiteOffices', this.loadOnsiteOffices$.pipe(switchMap(() => this.getOnsiteOffices())));
  }

  getBaseOffices(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/offices/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }

  getOnsiteOffices(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/office/onsite`).pipe(catchError(() => of([])));
  }

  doLoadOffices(): void {
    if (!this.get('offices')) {
      this.loadOffices$.next();
    }
  }

  doRefreshOffices(): void {
    if (this.get('offices')) {
      this.loadOffices$.next();
    }
  }

  doLoadOnsiteOffices(): void {
    if (!this.get('onsiteOffices')) {
      this.loadOnsiteOffices$.next();
    }
  }

  doRefreshOnsiteOffices(): void {
    if (this.get('onsiteOffices')) {
      this.loadOnsiteOffices$.next();
    }
  }

  doGetOffices(officeId: string): Observable<BaseObject | undefined> {
    return this.offices$.pipe(map((offices) => offices.find((office) => office.id === officeId)));
  }

  getOffices(params: HttpParams): Observable<Pagination<Office>> {
    return this.http.get<PagingResponse<Office>>(`${ACCOUNT_API_PATH}/offices`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of(DEFAULT_PAGINATION_DATA))
    );
  }

  editOffice(payload: Office): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/offices/${payload.id}`, payload);
  }
}
