import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { OrgRes } from '../models/node';

@Injectable({
  providedIn: 'root',
})
export class HumanResourceService {
  constructor(private httpClient: HttpClient) {}

  getOrg(id: string): Observable<OrgRes> {
    return this.httpClient.get<OrgRes>(`${ACCOUNT_API_PATH}/org-chart${id ? `/${id}` : ''}`);
  }
}
