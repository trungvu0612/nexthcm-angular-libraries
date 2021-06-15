import { Injectable } from '@angular/core';
import { OfficeDetail, SeatZone, SeatZoneResponse, Zone } from '../models/offices';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const OFFICE_LIST = {
  name: 'Copac',
  adder: 'Hạnh Hồng',
  description: 'Văn Phòng tại copac',
  address: '12 Nguyễn Duy Trinh, quận 9',
  numberOfRoom: 11,
  office: {
    id: 'asdsd',
    name: 'Copac',
  },
  room: '2',
};

@Injectable({
  providedIn: 'root',
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {}

  getOfficeList(): Observable<Zone[]> {
    this.http.get('/mytimeapp/v1.0/offices').subscribe((response) => console.log('get', response));
    return of(Array(26).fill(OFFICE_LIST));
  }

  addOffice(body: Partial<OfficeDetail>): Observable<any> {
    return of('');
    // return this.http.post('/mytimeapp/v1.0/offices', body);
  }

  editOffice(body: OfficeDetail): Observable<any> {
    return of('');
    // return this.http.put('/mytimeapp/v1.0/offices', body);
  }

  getSeatZones(): Observable<Partial<SeatZone>[]> {
    return this.http.get<SeatZoneResponse>('/mytimeapp/v1.0/seats-zone').pipe(map((data) => data.items));
  }

  addSeatZone(body: Partial<SeatZone>): Observable<any> {
    return this.http.post('/mytimeapp/v1.0/seats-zone', body);
  }
}
