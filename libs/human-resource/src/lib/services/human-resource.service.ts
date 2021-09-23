import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ACCOUNT_API_PATH } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { OrgChart } from '../models/node';

// interface OrgState {
//   orgChart: OrgChart[];
// }

@Injectable()
export class HumanResourceService {

  public description!: OrgChart;
  public hovered = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  getOrg(): Observable<OrgChart[]> {
    return this.httpClient.get<OrgChart[]>(`${ACCOUNT_API_PATH}/org-chart`);
  }

  getOrgId(org: string | undefined): Observable<OrgChart[]> {
    return this.httpClient.get<OrgChart[]>(`${ACCOUNT_API_PATH}/org-chart${org ? `/${org}` : ''}`);
  }

  // searchOrg(params: { filter: string }): Observable<OrgChart[]> {
  //   return this.httpClient.get<BaseResponse<OrgChart[]>>(`${ACCOUNT_API_PATH}/org-chart-filter`, { params }).pipe(
  //     map((response) => response.data),
  //     catchError(() => of([]))
  //   );
  // }
}
