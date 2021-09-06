import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseObject, BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Domain, OrganizationalLevel, OrganizationalUnit, OrganizationalUnitForm, Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root',
})
export class AdminTenantService extends RxState<{ id: string }> {
  constructor(private readonly http: HttpClient) {
    super();
  }

  getUsers(): Observable<Partial<UserDto>[]> {
    return this.http
      .get<PagingResponse<UserDto>>(`${ACCOUNT_API_PATH}/users/v2`, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  searchUsers(searchQuery: string): Observable<BaseObject[]> {
    return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(
      map((res) => res.data),
      catchError(() => of([]))
    );
  }

  getTenants(params: { [key: string]: number }): Observable<Pagination<Partial<Tenant>>> {
    return this.http
      .get<PagingResponse<Partial<Tenant>>>(`${ACCOUNT_API_PATH}/tenants`, { params })
      .pipe(map((response) => response.data));
  }

  getTenant(): Observable<Partial<Tenant>> {
    return this.http
      .get<BaseResponse<Partial<Tenant>>>(`${ACCOUNT_API_PATH}/tenants/${this.get(`id`)}`)
      .pipe(map((response) => response.data));
  }

  checkShortname(body: Partial<Tenant>): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/tenants/check-existing`, body);
  }

  createTenant(body: Partial<Tenant>): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/tenants`, body);
  }

  editTenant(body: Partial<Tenant>): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/tenants/` + body.id, body);
  }

  deleteTenant(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/tenants/` + id);
  }

  getTenantDetail(id: string): Observable<Tenant> {
    return this.http.get<BaseResponse<Tenant>>(`${ACCOUNT_API_PATH}/tenants/${id}`).pipe(map((res) => res.data));
  }

  getDomains(): Observable<Partial<Domain>[]> {
    return this.http.get<Partial<Domain>[]>(`${ACCOUNT_API_PATH}/domains`);
  }

  editDomain(body: Partial<Domain>): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/domains/` + body.id, body);
  }

  getDomainDetail(id: string): Observable<Domain> {
    return this.http.get<BaseResponse<Domain>>(`${ACCOUNT_API_PATH}/domains/${id}`).pipe(map((res) => res.data));
  }

  createDomain(body: Partial<Domain>): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/domains`, body);
  }

  deleteDomain(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/domains/` + id);
  }

  getOrganizationalStructure(): Observable<Partial<OrganizationalLevel>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalLevel>[]>>(
        `${ACCOUNT_API_PATH}/org-type-label-by-tenant/${this.get('id')}`
      )
      .pipe(map((response) => response.data));
  }

  upsertOrganizationalLevel(body: Partial<OrganizationalLevel>, type: `post` | `put`): Observable<unknown> {
    return this.http[type](`${ACCOUNT_API_PATH}/org-type-label`, body).pipe();
  }

  deleteOrganizationalLevel(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/org-type-label/` + id);
  }

  getOrganizationalLevels(): Observable<string[]> {
    return this.http
      .get<BaseResponse<string[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-type`)
      .pipe(map((response) => response.data));
  }

  getOrgDetail(id: string | undefined): Observable<OrganizationalUnitForm> {
    return this.http.get<BaseResponse<OrganizationalUnitForm>>(`${ACCOUNT_API_PATH}/orgs/${id}`).pipe(map((res) => res.data));
  }

  getParentLevel(orgType: string): Observable<Partial<OrganizationalUnit>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalUnit>[]>>(`${ACCOUNT_API_PATH}/orgs/parent-org-by-org-type`, {
        params: { orgType, tenantId: this.get(`id`) },
      })
      .pipe(map((response) => response.data));
  }

  getOrganizationChart(): Observable<Partial<OrganizationalUnit>> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalUnit>[]>>(
        `${ACCOUNT_API_PATH}/orgs/get-org-structure-chart/` + this.get(`id`)
      )
      .pipe(map((response) => response.data[0]));
  }

  createOrganizationUnit(body: Partial<OrganizationalUnitForm>): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/orgs`, body);
  }

  editOrganizationUnit(body: Partial<OrganizationalUnitForm>): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/orgs/` + body.id, body);
  }

  deleteOrganizationUnit(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/orgs/` + id);
  }
}
