import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { Environment, ENVIRONMENT, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { SearchWorkingHour, WorkingHour } from '../models/working-hour';
import { MY_REQUEST_PAGINATOR } from '../state/my-request/my-request.paginator';

@Injectable({
  providedIn: 'root'
})
export class WorkingHourService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';
  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private httpClient: HttpClient,
  ) {}

  getWorkingHour(pageIndex: number, pageSize: number, search: SearchWorkingHour): Observable<PagingResponse<WorkingHour>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
    });
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours-date', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }
}
