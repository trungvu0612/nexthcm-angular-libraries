import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, MY_TIME_API_PATH, PagingResponse, Seat, UserDto, Zone } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SeatMapsState {
  users: Partial<UserDto>[];
  seatMaps: Partial<Zone>[];
}

@Injectable({
  providedIn: 'root',
})
export class SeatMapsService extends RxState<SeatMapsState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('users', this.getUsers());
    this.connect('seatMaps', this.getSeatMaps());
  }

  getUsers(): Observable<Partial<UserDto>[]> {
    return this.http
      .get<PagingResponse<UserDto>>(`${ACCOUNT_API_PATH}/users/v2`, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMaps(): Observable<Partial<Zone>[]> {
    return this.http
      .get<PagingResponse<Zone>>(`${MY_TIME_API_PATH}/seats-map`, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMap(id?: string): Observable<Partial<Zone>> {
    return this.http.get<Partial<Zone>>(`${MY_TIME_API_PATH}${id ? `/seats-map/${id}` : `/my-seats-map`}`);
  }

  assignedUser(seatId: string, body: Partial<Seat>): Observable<Partial<Seat>> {
    return this.http.put(`${MY_TIME_API_PATH}/seats-map/assign-seat/${seatId}`, body);
  }
}
