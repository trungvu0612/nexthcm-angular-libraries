import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse, Zone } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZoneType } from '../models/offices';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const ACCOUNT_APP_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {}

  getZoneData(type: ZoneType, params: { [key: string]: number }): Observable<Pagination<Zone>> {
    return type === 'office'
      ? this.http
          .get<PagingResponse<Zone>>(ACCOUNT_APP_PATH + '/offices', { params })
          .pipe(map((response) => response.data))
      : this.http
          .get<PagingResponse<Zone>>(MY_TIME_PATH + '/seats-map', { params })
          .pipe(map((response) => response.data));
  }

  addOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.post(ACCOUNT_APP_PATH + '/offices', body);
  }

  editOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.put(ACCOUNT_APP_PATH + '/offices/' + body.id, body);
  }

  addSeatZone(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.post(MY_TIME_PATH + '/seats-map', body);
  }

  editSeatZone(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.put(MY_TIME_PATH + '/seats-map/' + body.id, body);
  }
}
