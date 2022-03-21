import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WorkingHoursGroup } from '../models';
import { UserTimeLog } from '../models/import-time-log';

@Injectable()
export class WorkingHoursService {
  constructor(private readonly http: HttpClient) {}

  getWorkingHoursOfEveryone(params: HttpParams): Observable<Pagination<WorkingHoursGroup>> {
    return this.http
      .get<PagingResponse<WorkingHoursGroup>>(`${MY_TIME_API_PATH}/working-hours-everyone`, { params })
      .pipe(map((res) => res.data));
  }

  exportTimeLog(params: HttpParams): Observable<Blob> {
    return this.http.get(`${MY_TIME_API_PATH}/working-hours-everyone/export`, { params, responseType: 'blob' });
  }

  importTimeLog(file: File): Observable<UserTimeLog[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ data: UserTimeLog[] }>(`${MY_TIME_API_PATH}/working-hours/preview-import-data-cross-check`, formData)
      .pipe(map(({ data }) => data));
  }

  saveTimeLog(metaData: UserTimeLog[]): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/working-hours/process-data-cross-check`, { metaData });
  }
}
