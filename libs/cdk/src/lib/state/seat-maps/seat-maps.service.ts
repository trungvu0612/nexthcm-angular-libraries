import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MY_TIME_API_PATH } from '../../constants';
import { PagingResponse, SeatMap } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SeatMapsService {
  constructor(private readonly http: HttpClient) {}

  // TODO: change api
  getAllSeatMaps(): Observable<SeatMap[]> {
    return this.http
      .get<PagingResponse<SeatMap>>(`${MY_TIME_API_PATH}/seats-map`, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }
}
