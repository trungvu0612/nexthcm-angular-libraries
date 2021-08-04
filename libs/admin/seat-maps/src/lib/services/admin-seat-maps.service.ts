import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse, Zone } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable()
export class AdminSeatMapsService extends RxState<{ offices: Partial<Zone>[] }> {
  constructor(private http: HttpClient) {
    super();
    this.connect(
      'offices',
      this.http
        .get<PagingResponse<Zone>>('/accountapp/v1.0/offices', { params: { size: 999 } })
        .pipe(map((response) => response.data.items))
    );
  }

  getSeatMaps(params: { [key: string]: number }): Observable<Pagination<Zone>> {
    return this.http
      .get<PagingResponse<Zone>>(MY_TIME_PATH + '/seats-map', { params })
      .pipe(map((response) => response.data));
  }

  getSeatMap(id: string): Observable<Partial<Zone>> {
    return this.http.get<Partial<Zone>>(`${MY_TIME_PATH}/seats-map/${id}`);
  }

  createSeatMap(body: Partial<Zone>): Observable<unknown> {
    return this.http.post(MY_TIME_PATH + '/seats-map', body);
  }

  editSeatMap(body: Partial<Zone>): Observable<unknown> {
    return this.http.put(MY_TIME_PATH + '/seats-map/' + body.id, body);
  }
}
