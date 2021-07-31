import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeavePeriod } from '../models/leave-period';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable({
  providedIn: 'root'
})
export class AdminPeriodService {

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private http: HttpClient) {}

  getAdminPeriods(pageIndex: number, pageSize: number): Observable<PagingResponse<LeavePeriod>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<LeavePeriod>>(`${MY_TIME_PATH}/leave-periods/`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminPeriodId(id: LeavePeriod | string): Observable<LeavePeriod> {
    if (id === undefined || id === '') {
      return this.http.get<LeavePeriod>(this.env.apiUrl + `${MY_TIME_PATH}/leave-periods/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<LeavePeriod>(this.env.apiUrl + `${MY_TIME_PATH}/leave-periods/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createAdminPeriodId(body: any): Observable<LeavePeriod> {
    return this.http.post<LeavePeriod>(`${MY_TIME_PATH}/leave-periods`, body);
  }

  editAdminPeriodId(id: string | undefined, body: any): Observable<LeavePeriod> {
    return this.http.put<LeavePeriod>(`${MY_TIME_PATH}/leave-periods/${id}`, body);
  }

  deleteAdminPeriodId(id: string): Observable<LeavePeriod> {
    return this.http.delete<LeavePeriod>(`${MY_TIME_PATH}/leave-periods/${id}`);
  }

}
