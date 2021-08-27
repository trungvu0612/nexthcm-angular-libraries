import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Domain, OrganizationalLevel, OrganizationalUnit, OrganizationalUnitForm, Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root'
})
export class AdminTenantService extends RxState<{ id: string }> {
  constructor(private readonly http: HttpClient) {
    super();
  }

  getUsers(): Observable<Partial<UserDto>[]> {
    return this.http
      .get<PagingResponse<UserDto>>('/accountapp/v1.0/users', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getTenants(params: { [key: string]: number }): Observable<Pagination<Partial<Tenant>>> {
    return this.http
      .get<PagingResponse<Partial<Tenant>>>('/accountapp/v1.0/tenants', { params })
      .pipe(map((response) => response.data));
  }

  getTenant(): Observable<Partial<Tenant>> {
    return this.http
      .get<BaseResponse<Partial<Tenant>>>('/accountapp/v1.0/tenants/' + this.get('id'))
      .pipe(map((response) => response.data));
  }

  checkShortname(body: Partial<Tenant>): Observable<unknown> {
    return this.http.post('/accountapp/v1.0/tenants/check-existing', body);
  }

  createTenant(body: Partial<Tenant>): Observable<unknown> {
    return this.http.post('/accountapp/v1.0/tenants', body);
  }

  editTenant(body: Partial<Tenant>): Observable<unknown> {
    return this.http.put('/accountapp/v1.0/tenants/' + body.id, body);
  }

  deleteTenant(id: string): Observable<unknown> {
    return this.http.delete('/accountapp/v1.0/tenants/' + id);
  }

  getTenantDetail(id: string): Observable<Tenant> {
    return this.http.get<BaseResponse<Tenant>>(`/accountapp/v1.0/tenants/${id}`).pipe(map((res) => res.data));
  }

  getDomains(): Observable<Partial<Domain>[]> {
    return this.http.get<Partial<Domain>[]>('/accountapp/v1.0/domains');
  }

  editDomain(body: Partial<Domain>): Observable<unknown> {
    return this.http.put('/accountapp/v1.0/domains/' + body.id, body);
  }

  getDomainDetail(id: string): Observable<Domain> {
    return this.http.get<BaseResponse<Domain>>(`/accountapp/v1.0/domains/${id}`).pipe(map((res) => res.data));
  }

  createDomain(body: Partial<Domain>): Observable<unknown> {
    return this.http.post('/accountapp/v1.0/domains', body);
  }

  deleteDomain(id: string): Observable<unknown> {
    return this.http.delete('/accountapp/v1.0/domains/' + id);
  }

  getOrganizationalStructure(): Observable<Partial<OrganizationalLevel>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalLevel>[]>>('/accountapp/v1.0/org-type-label')
      .pipe(map((response) => response.data));
  }

  upsertOrganizationalLevel(body: Partial<OrganizationalLevel>, type: 'post' | 'put'): Observable<unknown> {
    return this.http[type]('/accountapp/v1.0/org-type-label', body).pipe();
  }

  deleteOrganizationalLevel(id: string): Observable<unknown> {
    return this.http.delete('/accountapp/v1.0/org-type-label/' + id);
  }

  getOrganizationalLevels(): Observable<string[]> {
    return this.http
      .get<BaseResponse<string[]>>('/accountapp/v1.0/orgs/get-org-type')
      .pipe(map((response) => response.data));
  }

  getParentLevel(orgType: string): Observable<Partial<OrganizationalUnit>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalUnit>[]>>('/accountapp/v1.0/orgs/parent-org-by-org-type', {
        params: { orgType, tenantId: this.get('id') }
      })
      .pipe(map((response) => response.data));
  }

  getOrganizationChart(): Observable<Partial<OrganizationalUnit>> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalUnit>[]>>(
        '/accountapp/v1.0/orgs/get-org-structure-chart/' + this.get('id')
      )
      .pipe(map((response) => response.data[0]));
  }

  createOrganizationUnit(body: Partial<OrganizationalUnitForm>): Observable<unknown> {
    return this.http.post('/accountapp/v1.0/orgs', body);
  }

  editOrganizationUnit(body: Partial<OrganizationalUnit>): Observable<unknown> {
    return this.http.put('/accountapp/v1.0/orgs/' + body.id, body);
  }

  deleteOrganizationUnit(id: string): Observable<unknown> {
    return this.http.delete('/accountapp/v1.0/orgs/' + id);
  }
}
