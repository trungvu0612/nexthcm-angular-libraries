import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, BaseResponse, Organization, PagingResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  readonly currentTenantId = () => this.authService.get('userInfo', 'tenantId') as string;

  getCurrentOrganizationStructure(): Observable<Organization> {
    return this.getOrganizationStructure(this.currentTenantId());
  }

  getOrganizationStructure(id: string): Observable<Organization> {
    return this.http
      .get<BaseResponse<Organization[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-structure-chart/${id}`)
      .pipe(map((res) => res.data[0] || {}));
  }

  getOrganizationChart(tenantId: string): Observable<Organization[]> {
    return this.http
      .get<BaseResponse<Organization[]>>(`${ACCOUNT_API_PATH}/orgs/get-org-structure-chart/${tenantId}`)
      .pipe(map((res) => res.data));
  }

  getBaseOrganizations(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/orgs/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }
}
