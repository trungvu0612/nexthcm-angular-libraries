import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import {
  ACCOUNT_API_PATH,
  Office,
  Pagination,
  PagingResponse,
  refreshOffices,
  refreshOnsiteOffices,
} from '@nexthcm/cdk';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AdminOfficesService {
  constructor(private readonly http: HttpClient, private readonly actions: Actions) {}

  getOffices(params: HttpParams): Observable<Pagination<Office>> {
    return this.http.get<PagingResponse<Office>>(`${ACCOUNT_API_PATH}/offices`, { params }).pipe(
      map((res) => res.data),
      catchError(() => EMPTY)
    );
  }

  upsertOffice(payload: Office): Observable<unknown> {
    return (payload.id ? this.editOffice(payload) : this.createOffice(payload)).pipe(
      tap(() => {
        this.actions.dispatch(refreshOffices());
        if (payload.onsite) {
          this.actions.dispatch(refreshOnsiteOffices());
        }
      })
    );
  }

  createOffice(payload: Office): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/offices`, payload);
  }

  editOffice(payload: Office): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/offices/${payload.id}`, payload);
  }

  deleteOffice(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/offices/${id}`, {}).pipe(
      tap(() => {
        this.actions.dispatch(refreshOffices());
        this.actions.dispatch(refreshOnsiteOffices());
      })
    );
  }
}
