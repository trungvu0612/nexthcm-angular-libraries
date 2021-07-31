import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Office } from '../models/offices';
import { WorkingAfterTime } from '../models/working-after-time';
import { WorkingTimes } from '../models/working-times';

@Injectable({
  providedIn: 'root',
})
export class WorkingTimesService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getSettings(): Observable<PagingResponse<WorkingTimes>> {
    return this.httpClient.get<PagingResponse<WorkingTimes>>(`${this.appVersion}/config/times`);
  }

  saveSettings(dto: WorkingTimes): Observable<WorkingTimes> {
    return this.httpClient.post<WorkingTimes>(`${this.appVersion}/config/times`, dto);
  }

  // getBranchDatas(pageIndex: number, pageSize: number): Observable<any> {
  //   return this.httpClient.get<any>('/accountapp/v1.0/orgs', {
  //     params: new HttpParams()
  //       .set('page', pageIndex ? pageIndex.toString() : '')
  //       .set('size', pageSize ? pageSize.toString() : ''),
  //   });
  // }

  getOffices(): Observable<PagingResponse<Office>> {
    return this.httpClient.get<PagingResponse<Office>>(`/accountapp/v1.0/orgs`);
  }

  getOvertimeConfigByOrg(orgType: string): Observable<Partial<WorkingAfterTime>[]> {
    return this.httpClient.get<Partial<WorkingAfterTime>[]>(
      `/accountapp/v1.0/config/times/overtime-config-by-org-id/` + orgType
    );
  }

  submitWorkingAfterTime(body: any): Observable<WorkingAfterTime> {
    return this.httpClient.post<WorkingAfterTime>(`${this.appVersion}/config/times/overtime`, body);
  }

  statusChecking(): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/check-in-out');
  }
}
