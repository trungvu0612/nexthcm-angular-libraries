import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, Holiday, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Office } from '../models/offices';
import { Organization } from '../models/organization';
import { WorkingAfterTime } from '../models/working-after-time';
import { WorkingTimes } from '../models/working-times';

@Injectable({
  providedIn: 'root',
})
export class WorkingTimesService {
  constructor(private httpClient: HttpClient) {}

  getSettings(): Observable<PagingResponse<WorkingTimes>> {
    return this.httpClient.get<PagingResponse<WorkingTimes>>(`${MY_TIME_API_PATH}/config/times`);
  }

  saveSettings(dto: WorkingTimes): Observable<WorkingTimes> {
    return this.httpClient.post<WorkingTimes>(`${MY_TIME_API_PATH}/config/times`, dto);
  }

  getOffices(): Observable<PagingResponse<Office>> {
    return this.httpClient.get<PagingResponse<Office>>(`/accountapp/v1.0/offices`);
  }

  getOrgs(): Observable<PagingResponse<Organization>> {
    return this.httpClient.get<PagingResponse<Organization>>(`/accountapp/v1.0/orgs`);
  }

  getOrganizationChart(tenantId: string): Observable<Organization[]> {
    return this.httpClient
      .get<BaseResponse<Organization[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-structure-chart/${tenantId}`)
      .pipe(map((res) => res.data));
  }

  submitWorkingAfterTime(body: any): Observable<WorkingAfterTime> {
    return this.httpClient.post<WorkingAfterTime>(`${MY_TIME_API_PATH}/config/times/overtime`, body);
  }

  statusChecking(): Observable<any> {
    return this.httpClient.get<any>(MY_TIME_API_PATH + '/check-in-out');
  }

  getWorkingHourConfigByOrg(orgId: any): Observable<any> {
    return this.httpClient.get<any>(`${MY_TIME_API_PATH}/config/times/working-hour-config-by-org-id/` + orgId);
  }

  getOvertimeConfigByOrg(orgId: string): Observable<any> {
    return this.httpClient
      .get<BaseResponse<any>>(`${MY_TIME_API_PATH}/config/times/overtime-config-by-org-id/` + orgId)
      .pipe(
        map((res) => res.data),
        catchError(() =>
          of({
            checkInAfter: {},
            checkOutBefore: {},
            endLunch: {},
            fingerPrint: {},
            items: [],
            lunchHours: {},
            maxOtHours: {},
            maxOtMinutes: {},
            minOtHours: {},
            minOMinutes: {},
            minStart: {},
            orgId: {},
            otBreakHours: {},
            startLunch: {},
            timePaidLeave: {},
            timePayroll: {},
            totalWorkinghour: {},
            workingHour: {},
          })
        )
      );
  }

  getHoliday(): Observable<PagingResponse<Holiday>> {
    return this.httpClient.get<PagingResponse<Holiday>>(`${MY_TIME_API_PATH}/holidays`);
  }

  addHoliday(dto: { recurringType: any; name: any; holidayDate: number }): Observable<any> {
    return this.httpClient.post<any>(`${MY_TIME_API_PATH}/holidays`, dto);
  }

  deleteHoliday(id: string): Observable<Holiday> {
    return this.httpClient.delete<Holiday>(`${MY_TIME_API_PATH}/holidays/` + id);
  }
}
