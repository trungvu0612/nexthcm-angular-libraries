import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { LeavePeriod } from '../../../../entitlement/src/lib/models/leave-period';

@Injectable({
  providedIn: 'root',
})
export class AdminPeriodService {
  constructor(private http: HttpClient) {}

  getAdminPeriod(params: HttpParams): Observable<PagingResponse<LeavePeriod>> {
    return this.http.get<PagingResponse<LeavePeriod>>(`${MY_TIME_API_PATH}/leave-periods`, { params });
  }

  createAdminPeriod(payload: LeavePeriod): Observable<LeavePeriod> {
    return this.http.post<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods`, payload);
  }

  editAdminPeriod(payload: LeavePeriod): Observable<LeavePeriod> {
    return this.http.put<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/${payload.id}`, payload);
  }

  deleteAdminPeriod(id: string): Observable<LeavePeriod> {
    return this.http.delete<LeavePeriod>(`${MY_TIME_API_PATH}/leave-periods/${id}`);
  }
}
