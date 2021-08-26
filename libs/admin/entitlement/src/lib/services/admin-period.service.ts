import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeavePeriod, ResLeavePeriod } from '../models/leave-period';

@Injectable({
  providedIn: 'root',
})
export class AdminPeriodService {
  constructor(private http: HttpClient) {}

  getAdminPeriods(pageIndex: number, pageSize: number): Observable<PagingResponse<LeavePeriod>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<LeavePeriod>>(`${MY_TIME_API_PATH}/leave-periods/`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminPeriodId(id: LeavePeriod | string): Observable<LeavePeriod> {
    if (id === undefined || id === '') {
      return this.http.get<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<ResLeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/${id}`, {})
        .pipe(map((res) => res.data as LeavePeriod));
    }
  }

  createAdminPeriodId(body: any): Observable<LeavePeriod> {
    return this.http.post<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods`, body);
  }

  editAdminPeriodId(id: string | undefined, body: any): Observable<LeavePeriod> {
    return this.http.put<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/${id}`, body);
  }

  deleteAdminPeriodId(id: string): Observable<LeavePeriod> {
    return this.http.delete<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/${id}`);
  }
}
