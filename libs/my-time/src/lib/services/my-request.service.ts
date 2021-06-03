import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Requests, SearchRequest } from '../models/requests';

@Injectable({
  providedIn: 'root'
})
export class MyRequestService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private httpClient: HttpClient
  ) {
  }

  getMyRequests(pageIndex: number, pageSize: number, search: SearchRequest): Observable<PagingResponse<Requests>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchRequest]);
    });
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/requests', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
    });
  }
}
