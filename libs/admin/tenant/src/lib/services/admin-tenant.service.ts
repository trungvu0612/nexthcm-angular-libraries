import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Domain, OrganizationalLevel, OrganizationalUnit, OrganizationalUnitForm, Tenant } from '../models/tenant';

interface State {
  users: Partial<UserDto>[];
  levels: string[];
  structure: Partial<OrganizationalLevel>[];
  organization: Partial<OrganizationalUnit>[];
}

@Injectable()
export class AdminTenantService extends RxState<State> {
  constructor(private readonly http: HttpClient) {
    super();
    this.connect('users', this.getUsers());
    this.connect('levels', this.getOrganizationalLevels());
    this.connect('structure', this.getOrganizationalStructure());
    this.connect('organization', this.getOrganization());
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

  getTenant(id: string): Observable<Partial<Tenant>> {
    return this.http
      .get<BaseResponse<Partial<Tenant>>>('/accountapp/v1.0/tenants/' + id)
      .pipe(map((response) => response.data));
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

  getDomains(): Observable<Partial<Domain>[]> {
    return this.http.get<Partial<Domain>[]>('/accountapp/v1.0/domains');
  }

  getOrganizationalStructure(): Observable<Partial<OrganizationalLevel>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalLevel>[]>>('/accountapp/v1.0/org-type-label')
      .pipe(map((response) => response.data));
  }

  upsertOrganizationalLevel(body: Partial<OrganizationalLevel>, type: 'post' | 'put'): Observable<unknown> {
    return this.http[type]('/accountapp/v1.0/org-type-label', body).pipe(
      tap(() => this.connect('structure', this.getOrganizationalStructure()))
    );
  }

  deleteOrganizationalLevel(id: string): Observable<unknown> {
    return this.http
      .delete('/accountapp/v1.0/org-type-label/' + id)
      .pipe(tap(() => this.connect('structure', this.getOrganizationalStructure())));
  }

  getOrganizationalLevels(): Observable<string[]> {
    return this.http
      .get<BaseResponse<string[]>>('/accountapp/v1.0/orgs/get-org-type')
      .pipe(map((response) => response.data));
  }

  getParentLevel(orgType: string): Observable<Partial<OrganizationalUnit>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalUnit>[]>>('/accountapp/v1.0/orgs/parent-org-by-org-type', {
        params: { orgType },
      })
      .pipe(map((response) => response.data));
  }

  getOrganization(): Observable<Partial<OrganizationalUnit>[]> {
    return this.http
      .get<PagingResponse<Partial<OrganizationalUnit>>>('/accountapp/v1.0/orgs', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  createOrganizationUnit(body: Partial<OrganizationalUnitForm>): Observable<unknown> {
    return this.http
      .post('/accountapp/v1.0/orgs', body)
      .pipe(tap(() => this.connect('organization', this.getOrganization())));
  }

  deleteOrganizationUnit(id: string): Observable<unknown> {
    return this.http
      .delete('/accountapp/v1.0/orgs/' + id)
      .pipe(tap(() => this.connect('organization', this.getOrganization())));
  }
}
