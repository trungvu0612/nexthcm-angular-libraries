import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse, Seat, UserDto, Zone } from '@nexthcm/cdk';
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
      .get<PagingResponse<UserDto>>('/accountapp/v1.0/users', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMaps(): Observable<Partial<Zone>[]> {
    return this.http
      .get<PagingResponse<Zone>>('/mytimeapp/v1.0/seats-map', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMap(id?: string): Observable<Partial<Zone>> {
    const path = id ? `/seats-map/${id}` : '/my-seats-map';
    return this.http.get<Partial<Zone>>('/mytimeapp/v1.0' + path);
  }

  assignedUser(seatId: string, body: Partial<Seat>): Observable<Partial<Seat>> {
    return this.http.put('/mytimeapp/v1.0/seats-map/assign-seat/' + seatId, body);
  }
}
