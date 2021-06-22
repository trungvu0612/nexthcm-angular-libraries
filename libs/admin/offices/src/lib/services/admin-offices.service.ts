import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response, ResponseData, Zone } from '@nexthcm/ui';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZoneType } from '../models/offices';

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
    const key = type === 'office' ? 'offices' : 'seats-map';
    return this.http.get<Response<Zone>>('/mytimeapp/v1.0/' + key, { params }).pipe(map((response) => response.data));
  }

  addSeatZone(body: Partial<Zone>): Observable<any> {
    return this.http.post('/mytimeapp/v1.0/seats-map', body);
  }

  editSeatZone(body: Partial<Zone>): Observable<any> {
    return this.http.put('/mytimeapp/v1.0/seats-map/' + body.id, body);
  }
}
