import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestConfig } from './request-config';

@Injectable()
export class AdminRequestsConfigurationService {
  constructor(private readonly http: HttpClient) {}

  getRequestsConfig(): Observable<RequestConfig[]> {
    return this.http
      .get<BaseResponse<RequestConfig[]>>(`${MY_TIME_API_PATH}/configurations/requests`)
      .pipe(map((res) => res.data));
  }

  updateRequestConfig(payload: RequestConfig): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/configurations/requests`, payload);
  }
}
