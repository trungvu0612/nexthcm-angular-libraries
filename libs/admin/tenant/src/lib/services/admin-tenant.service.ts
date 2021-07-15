import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Domain, OrganizationalLevel, OrganizationalUnit, OrganizationalUnitForm, Tenant } from '../models/tenant';

interface State {
  tenant: Partial<Tenant>;
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
    this.set({
      tenant: {
        tenantName: 'Ban Vien Corp',
        image: 'd6e6eec4-bd8c-4a34-bf3f-f2d3a11716aa/banvien/banvien.png',
      },
    });
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

  postTenant(body: Partial<Tenant>): Observable<Partial<Tenant>> {
    return this.http.post<Partial<Tenant>>('/accountapp/v1.0/tenants', body);
  }

  getDomains(): Observable<Partial<Domain>[]> {
    return this.http.get<Partial<Domain>[]>('/accountapp/v1.0/domains');
  }

  getOrganizationalStructure(): Observable<Partial<OrganizationalLevel>[]> {
    return this.http
      .get<BaseResponse<Partial<OrganizationalLevel>[]>>('/accountapp/v1.0/org-type-label')
      .pipe(map((response) => response.data));
  }

  upsertOrganizationalLevel(
    body: Partial<OrganizationalLevel>,
    type: 'post' | 'put'
  ): Observable<Partial<OrganizationalLevel>[]> {
    return this.http[type]<Partial<OrganizationalLevel>[]>('/accountapp/v1.0/org-type-label', body).pipe(
      tap(() => this.connect('structure', this.getOrganizationalStructure()))
    );
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

  postOrganizationUnit(body: Partial<OrganizationalUnitForm>): Observable<BaseResponse<Partial<OrganizationalUnit>>> {
    return this.http
      .post<BaseResponse<Partial<OrganizationalUnit>>>('/accountapp/v1.0/orgs', body)
      .pipe(tap(() => this.connect('organization', this.getOrganization())));
  }
}
