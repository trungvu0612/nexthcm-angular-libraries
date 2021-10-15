import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, PagingResponse, parseJsonStringFields } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { Seat, SeatMap } from './models';

@Injectable({
  providedIn: 'root',
})
export class SeatMapsService {
  constructor(private http: HttpClient) {}

  /*
   * @deprecated TODO: change api
   */
  getAllSeatMaps(): Observable<SeatMap[]> {
    return this.http
      .get<PagingResponse<SeatMap>>(`${MY_TIME_API_PATH}/seats-map`, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMap(id?: string): Observable<SeatMap> {
    return (
      id
        ? this.http.get<SeatMap>(`${MY_TIME_API_PATH}/seats-map/${id}`)
        : this.http.get<BaseResponse<SeatMap>>(`${MY_TIME_API_PATH}/my-seats-map`).pipe(map((res) => res.data))
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
    return this.http.get(`${MY_TIME_API_PATH}/seats-map/check-existing?userId=${userId}`).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
