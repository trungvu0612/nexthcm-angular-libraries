import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Domain, Tenant } from '../models/tenant';
import { map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';

@Injectable()
export class AdminTenantService extends RxState<Tenant> {
  constructor(private readonly http: HttpClient) {
    super();
    this.set({
      tenantName: 'Ban Vien Corp',
      image: 'd6e6eec4-bd8c-4a34-bf3f-f2d3a11716aa/banvien/banvien.png',
    });
  }

  getTenants(params: { [key: string]: number }): Observable<Pagination<Partial<Tenant>>> {
    return this.http
      .get<PagingResponse<Partial<Tenant>>>('/accountapp/v1.0/tenants', { params })
      .pipe(map((response) => response.data));
  }

  postTenant(body: Partial<Tenant>): Observable<Partial<Tenant>> {
    return this.http.post<Partial<Tenant>>('/accountapp/v1.0/tenants', body);
  }

  getDomains(): Observable<Partial<Domain>[]> {
    return this.http.get<Partial<Domain>[]>('/accountapp/v1.0/domains');
  }
}
