import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { EmployeeNode } from '../models/employee-node';

@Injectable()
export class HumanResourceService {
  constructor(private httpClient: HttpClient) {}

  getOrgChartByUserId(userId?: string): Observable<EmployeeNode> {
    return this.httpClient.get<EmployeeNode>(`${ACCOUNT_API_PATH}/org-chart${userId ? `/${userId}` : ''}`);
  }
}
