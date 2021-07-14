import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
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
}
