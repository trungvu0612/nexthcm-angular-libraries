import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, PagingResponse } from '@nexthcm/cdk';
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
      .get<PagingResponse<Service | Action>>(`${ACCOUNT_API_PATH}/` + type, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getResourcesByAction(actionId: string): Observable<Partial<Resource>[]> {
    return this.http
      .get<PagingResponse<Resource>>(`${ACCOUNT_API_PATH}/resources`, { params: { actionId, size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getPermissions(params: HttpParams): Observable<PagingResponse<Policy>> {
    return this.http.get<PagingResponse<Policy>>(`${ACCOUNT_API_PATH}/permissions`, { params });
  }

  getPermission(policyId: string): Observable<Partial<Policy>> {
    return this.http.get<Partial<Policy>>(`${ACCOUNT_API_PATH}/permissions/` + policyId);
  }

  upsertPermission(body: Partial<Policy>): Observable<Partial<Policy>> {
    return this.http.post<Partial<Policy>>(`${ACCOUNT_API_PATH}/permissions`, body);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${ACCOUNT_API_PATH}/permissions/${id}`, {});
  }
}
