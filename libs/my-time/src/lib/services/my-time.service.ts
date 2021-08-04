import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrackingHistory, UpdateRequestPayload } from '../models';

const MY_TIME_PATH = '/mytimeapp/v1.0';

export enum RequestTypesUrlPath {
  leave = 'leaves',
  afterHours = 'ot-requests',
}

@Injectable({
  providedIn: 'root',
})
export class MyTimeService {
  constructor(private http: HttpClient) {}

  getTrackingHistory(id?: string): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${MY_TIME_PATH}/leaves/tracking-history/${id}`);
  }

  getRequests<T>(type: RequestTypesUrlPath, params: HttpParams, userId?: string): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_PATH}/${type}${userId ? `/${userId}` : ''}`, { params })
      .pipe(map((res) => res.data));
  }

  updateRequest(type: RequestTypesUrlPath, id: string, payload: UpdateRequestPayload): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_PATH}/${type}/${id}`, payload);
  }
}
