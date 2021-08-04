import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckingTime } from '../models/checking-time';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  checkIn(dto: CheckingTime): Observable<CheckingTime> {
    return this.httpClient.post<CheckingTime>(this.appVersion + `/check-in`, dto);
  }

  checkOut(dto: CheckingTime, idChecking: string): Observable<CheckingTime> {
    return this.httpClient.put<CheckingTime>(this.appVersion + `/check-out/` + idChecking, dto);
  }

  statusChecking(): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/check-in-out');
  }

  getTimeWorkingHour(id: any): Observable<any> {
    return this.httpClient
      .get<any>(this.appVersion + `/config/times/working-hour-config-by-org-id/${id}`)
      .pipe(map((data) => data as any));
  }

  getWorkingHourByDate(userId: string, fromDate: any, toDate: any): Observable<any> {
    return this.httpClient.get<any>(
      this.appVersion + '/working-hours?userId=' + userId + '&fromDate=' + fromDate + '&toDate=' + toDate
    );
  }
}
