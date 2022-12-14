import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, Pagination, PagingResponse } from '@nexthcm/cdk';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

import { BaseTenant, OrganizationalUnit, Tenant, TenantDomain } from '../models/tenant';
import { TenantStatusStatistic } from '../models/tenant-status-statistic';

@Injectable({
  providedIn: 'root',
})
export class AdminTenantsService {
  constructor(private readonly http: HttpClient) {}

  getTenants(params: HttpParams): Observable<Pagination<BaseTenant>> {
    return this.http.get<PagingResponse<BaseTenant>>(`${ACCOUNT_API_PATH}/tenants`, { params }).pipe(
      map((res) => res.data),
      catchError(() => EMPTY)
    );
  }

  checkTenantShortname(payload: Pick<Tenant, 'shortname'>): Observable<boolean> {
    return this.http.post(`${ACCOUNT_API_PATH}/tenants/check-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }

  createTenant(payload: Tenant): Observable<Tenant> {
    return this.http.post<BaseResponse<Tenant>>(`${ACCOUNT_API_PATH}/tenants`, payload).pipe(map((res) => res.data));
  }

  removeTenant(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/tenants/${id}`);
  }

  getTenant(id: string): Observable<Tenant> {
    return this.http.get<BaseResponse<Tenant>>(`${ACCOUNT_API_PATH}/tenants/${id}`).pipe(map((res) => res.data));
  }

  updateTenant(payload: Tenant): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/tenants/${payload.id}`, payload);
  }

  getTenantDomains(params: HttpParams): Observable<Pagination<TenantDomain>> {
    return this.http
      .get<PagingResponse<TenantDomain>>(`${ACCOUNT_API_PATH}/domains`, { params })
      .pipe(map((res) => res.data));
  }

  upsertTenantDomain(payload: TenantDomain): Observable<unknown> {
    return payload.id
      ? this.http.put(`${ACCOUNT_API_PATH}/domains/${payload.id}`, payload)
      : this.http.post(`${ACCOUNT_API_PATH}/domains`, payload);
  }

  removeTenantDomain(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/domains/${id}`);
  }

  getOrganizationalLevels(): Observable<string[]> {
    return this.http.get<BaseResponse<string[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-type`).pipe(map((res) => res.data));
  }

  getOrganizationalUnit(id: string): Observable<OrganizationalUnit> {
    return this.http
      .get<BaseResponse<OrganizationalUnit>>(`${ACCOUNT_API_PATH}/orgs/${id}`)
      .pipe(map((res) => res.data));
  }

  upsertOrganizationalUnit(payload: OrganizationalUnit): Observable<unknown> {
    return payload.id ? this.editOrganizationalUnit(payload) : this.createOrganizationalUnit(payload);
  }

  createOrganizationalUnit(payload: OrganizationalUnit): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/orgs`, payload);
  }

  editOrganizationalUnit(payload: OrganizationalUnit): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/orgs/${payload.id}`, payload);
  }

  deleteOrganizationalUnit(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/orgs/${id}`);
  }

  getStatisticByTenantStatus(): Observable<TenantStatusStatistic> {
    return this.http
      .get<BaseResponse<TenantStatusStatistic>>(`${ACCOUNT_API_PATH}/tenants-status`)
      .pipe(map((res) => res.data));
  }

  getParentLevel(orgType: string, tenantId: string): Observable<OrganizationalUnit[]> {
    return this.http
      .get<BaseResponse<OrganizationalUnit[]>>(`${ACCOUNT_API_PATH}/orgs/parent-org-by-org-type`, {
        params: { orgType, tenantId },
      })
      .pipe(map((res) => res.data));
  }

  checkDomainUrlExisting(payload: { domainUrl: string; tenant: { id: string } }): Observable<boolean> {
    return this.http.post(`${ACCOUNT_API_PATH}/domains/check-url-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }

  checkDomainNameExisting(payload: { name: string; tenant: { id: string } }): Observable<boolean> {
    return this.http.post(`${ACCOUNT_API_PATH}/domains/check-name-existing`, payload).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
