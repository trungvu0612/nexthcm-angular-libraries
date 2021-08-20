import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Holiday } from '../models/holiday';
import { Office } from '../models/offices';
import { Orgs } from '../models/orgs';
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

  getOffices(): Observable<PagingResponse<Office>> {
    return this.httpClient.get<PagingResponse<Office>>(`/accountapp/v1.0/offices`);
  }

  getOrgs(): Observable<PagingResponse<Orgs>> {
    return this.httpClient.get<PagingResponse<Orgs>>(`/accountapp/v1.0/orgs`);
  }

  submitWorkingAfterTime(body: any): Observable<WorkingAfterTime> {
    return this.httpClient.post<WorkingAfterTime>(`${this.appVersion}/config/times/overtime`, body);
  }

  statusChecking(): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/check-in-out');
  }

  getWorkingHourConfigByOrg(orgId: any): Observable<any> {
    return this.httpClient.get<any>(`${this.appVersion}/config/times/working-hour-config-by-org-id/` + orgId);
  }

  getOvertimeConfigByOrg(orgId: string): Observable<any> {
    return this.httpClient
      .get<BaseResponse<any>>(`${this.appVersion}/config/times/overtime-config-by-org-id/` + orgId)
      .pipe(map((res) => res.data));
  }

  getHoliday(): Observable<PagingResponse<Holiday>> {
    return this.httpClient.get<PagingResponse<Holiday>>(`${this.appVersion}/holidays`);
  }

  addHoliday(dto: { recurringType: any; name: any; holidayDate: number }): Observable<any> {
    return this.httpClient.post<any>(`${this.appVersion}/holidays`, dto);
  }

  deleteHoliday(id: string): Observable<Holiday> {
    return this.httpClient.delete<Holiday>(`${this.appVersion}/holidays/` + id);
  }
}
