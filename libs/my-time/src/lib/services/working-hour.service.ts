import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { SearchWorkingHour, WorkingHour } from '../models/working-hour';

@Injectable({
  providedIn: 'root'
})
export class WorkingHourService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getWorkingHour(pageIndex: number, pageSize: number, search: SearchWorkingHour): Observable<PagingResponse<WorkingHour>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
    });
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours-all', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getWorkingHourOnlyMe(pageIndex: number, pageSize: number, search: SearchWorkingHour): Observable<PagingResponse<WorkingHour>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
    });
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hour', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }
}
