import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, parseJsonStringFields, Seat, SeatMap } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeatMapsService {
  constructor(private readonly http: HttpClient) {}

  getSeatMap(id?: string, params?: HttpParams): Observable<SeatMap> {
    return (
      id
        ? this.http.get<SeatMap>(`${MY_TIME_API_PATH}/seats-map/${id}`, { params })
        : this.http
            .get<BaseResponse<SeatMap>>(`${MY_TIME_API_PATH}/my-seats-map`, { params })
            .pipe(map((res) => res.data))
    ).pipe(
      map((data) => {
        data.seats = data.seats.map((seat) => parseJsonStringFields(seat, ['style']));
        return data;
      }),
      catchError(() => of({} as SeatMap))
    );
  }

  assignUserForSeat(seatId: string, payload: Seat): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/seats-map/assign-seat/${seatId}`, payload);
  }

  checkUserAlreadyHasASeat(userId: string): Observable<boolean> {
    return this.http
      .get(`${MY_TIME_API_PATH}/seats-map/check-existing`, { params: new HttpParams().set('userId', userId) })
      .pipe(
        mapTo(true),
        catchError(() => of(false))
      );
  }
}
