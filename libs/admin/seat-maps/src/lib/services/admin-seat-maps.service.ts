import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { MY_TIME_API_PATH, Pagination, PagingResponse, refreshSeatMaps, SeatMap } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AdminSeatMapsService {
  constructor(private readonly http: HttpClient, private readonly actions: Actions) {}

  getSeatMaps(params: HttpParams): Observable<Pagination<SeatMap>> {
    return this.http
      .get<PagingResponse<SeatMap>>(`${MY_TIME_API_PATH}/seats-map`, { params })
      .pipe(map((res) => res.data));
  }

  getSeatMap(id: string): Observable<SeatMap> {
    return this.http.get<SeatMap>(`${MY_TIME_API_PATH}/seats-map/${id}`);
  }

  upsertSeatMap(payload: SeatMap): Observable<unknown> {
    return (payload.id ? this.editSeatMap(payload) : this.createSeatMap(payload)).pipe(
      tap(() => this.actions.dispatch(refreshSeatMaps()))
    );
  }

  createSeatMap(payload: SeatMap): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/seats-map`, payload);
  }

  editSeatMap(payload: SeatMap): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/seats-map/${payload.id}`, payload);
  }

  delete(id: string): Observable<unknown> {
    return this.http
      .delete(`${MY_TIME_API_PATH}/seats-map/${id}`)
      .pipe(tap(() => this.actions.dispatch(refreshSeatMaps())));
  }
}
