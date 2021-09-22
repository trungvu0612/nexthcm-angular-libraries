import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { ACCOUNT_API_PATH, BaseResponse, Organization } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
