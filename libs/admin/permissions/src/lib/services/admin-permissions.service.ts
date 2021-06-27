import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action, Policy, Resource, Service } from '../models/policy';
import { PagingResponse } from '@nexthcm/core';

interface StatePermissions {
  services: Partial<Service>[];
  actions: Partial<Action>[];
}

@Injectable()
export class AdminPermissionsService extends RxState<StatePermissions> {
  constructor(private http: HttpClient) {
    super();
    this.connect('services', this.getServicesOrActions('services'));
    this.connect('actions', this.getServicesOrActions('actions'));
  }

  getServicesOrActions(type: 'services' | 'actions'): Observable<Partial<Service | Action>[]> {
    return this.http
      .get<PagingResponse<Service | Action>>('/accountapp/v1.0/' + type, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getResourcesByAction(actionId: string): Observable<Partial<Resource>[]> {
    return this.http
      .get<PagingResponse<Resource>>('/accountapp/v1.0/resources', { params: { actionId, size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getPolicies(): Observable<Partial<Policy>[]> {
    return this.http
      .get<PagingResponse<Policy>>('/accountapp/v1.0/permissions')
      .pipe(map((response) => response.data.items));
  }

  postPolicy(body: Partial<Policy>): Observable<Partial<Policy>> {
    return this.http.post<Partial<Policy>>('/accountapp/v1.0/permissions', body);
  }

  getPolicy(policyId: string): Observable<Partial<Policy>> {
    return this.http.get<Partial<Policy>>('/accountapp/v1.0/permissions/' + policyId);
  }

  putPolicy(policyId: string, body: Partial<Policy>): Observable<Partial<Policy>> {
    return this.http.put<Partial<Policy>>('/accountapp/v1.0/permissions/' + policyId, body);
  }
}
