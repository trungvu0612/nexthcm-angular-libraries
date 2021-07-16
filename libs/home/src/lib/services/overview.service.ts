import { Injectable } from '@angular/core';
import { Seat } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CheckingTime } from '../models/checking-time';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  appVersion = '/mytimeapp/v1.0';
  constructor(private httpClient: HttpClient) { }

  checkIn(dto: CheckingTime): Observable<CheckingTime> {
    return this.httpClient.post<CheckingTime>(this.appVersion + `/check-in`, dto);
  }
  checkOut(dto: CheckingTime, idChecking: string): Observable<CheckingTime> {
    return this.httpClient.put<CheckingTime>(this.appVersion + `/check-out/`+idChecking, dto);
  }
  statusChecking(id: string, currentDate: any): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + `/check-in-out?userId=${id}&filterDate=${currentDate}`).pipe(map((data) => data as any));
  }
}