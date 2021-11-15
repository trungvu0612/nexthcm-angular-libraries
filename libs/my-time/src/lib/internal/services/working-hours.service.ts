import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkingHoursGroup } from '../models';

@Injectable()
export class WorkingHoursService {
  constructor(private readonly http: HttpClient) {}

  getWorkingHoursOfEveryone(params: HttpParams): Observable<Pagination<WorkingHoursGroup>> {
    return this.http
      .get<PagingResponse<WorkingHoursGroup>>(`${MY_TIME_API_PATH}/working-hours-everyone`, { params })
      .pipe(map((res) => res.data));
  }

  onExportTimeLog(params: HttpParams): Observable<Blob> {
    return this.http.get(`${MY_TIME_API_PATH}/working-hours-everyone/export`, { params, responseType: 'blob' });
  }
}
