import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SearchTenant, Tenant} from "../models/tenant";


@Injectable({
  providedIn: 'root',
})
export class TenantService {
  appVersion = this.env.apiUrl + '/accountapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}


  getTenant(pageIndex: number, pageSize: number, search: SearchTenant): Observable<PagingResponse<Tenant>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchTenant]);
    });
    return this.httpClient.get<PagingResponse<Tenant>>(this.appVersion + '/tenants', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }
}
