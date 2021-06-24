import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData, ResponseResult, Zone } from '@nexthcm/ui';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZoneType } from '../models/offices';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {}

  addOffice(body: Partial<Zone>): Observable<any> {
    return of('');
    // return this.http.post('/mytimeapp/v1.0/offices', body);
  }

  getZoneData(type: ZoneType, params: { page?: number; size?: number }): Observable<ResponseData<Zone>> {
    return type === 'office'
      ? this.http
          .get<ResponseResult<Zone>>('/accountapp/v1.0/offices', { params })
          .pipe(map((response) => response.data))
      : this.http
          .get<ResponseResult<Zone>>(MY_TIME_PATH + '/seats-map', { params })
          .pipe(map((response) => response.data));
  }

  addSeatZone(body: Partial<Zone>): Observable<any> {
    return this.http.post(MY_TIME_PATH + '/seats-map', body);
  }

  editSeatZone(body: Partial<Zone>): Observable<any> {
    return this.http.put(MY_TIME_PATH + '/seats-map/' + body.id, body);
  }
}
