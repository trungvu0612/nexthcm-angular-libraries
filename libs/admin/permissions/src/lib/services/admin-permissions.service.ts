import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action, Policy, Resource, Service } from '../models/policy';

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

  getPermissions(params: { [key: string]: number }): Observable<Pagination<Policy>> {
    return this.http
      .get<PagingResponse<Policy>>('/accountapp/v1.0/permissions', { params })
      .pipe(map((response) => response.data));
  }

  getPermission(policyId: string): Observable<Partial<Policy>> {
    return this.http.get<Partial<Policy>>('/accountapp/v1.0/permissions/' + policyId);
  }

  addPermission(body: Partial<Policy>): Observable<Partial<Policy>> {
    return this.http.post<Partial<Policy>>('/accountapp/v1.0/permissions', body);
  }

  editPermission(policyId: string, body: Partial<Policy>): Observable<Partial<Policy>> {
    return this.http.put<Partial<Policy>>('/accountapp/v1.0/permissions/' + policyId, body);
  }
}
