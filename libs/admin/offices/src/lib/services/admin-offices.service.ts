import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Zone, ZoneData, ZoneResponse, ZoneType } from '../models/offices';

@Injectable({
  providedIn: 'root',
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {}

  addOffice(body: Partial<Zone>): Observable<any> {
    return of('');
    // return this.http.post('/mytimeapp/v1.0/offices', body);
  }

  getZoneData(type: ZoneType, params = { page: 0, size: 10 }): Observable<Partial<ZoneData>> {
    const key = type === 'office' ? 'offices' : 'seats-map';
    return this.http.get<ZoneResponse>('/mytimeapp/v1.0/' + key, { params }).pipe(map((response) => response.data));
  }

  addSeatZone(body: Partial<Zone>): Observable<any> {
    return this.http.post('/mytimeapp/v1.0/seats-map', body);
  }
}
