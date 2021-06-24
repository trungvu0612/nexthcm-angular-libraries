import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '@nexthcm/ui';
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
      .get<ResponseResult<Service | Action>>('/accountapp/v1.0/' + type, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getPolicies(): Observable<Partial<Policy>[]> {
    return this.http
      .get<ResponseResult<Policy>>('/accountapp/v1.0/permissions')
      .pipe(map((response) => response.data.items));
  }

  getResourcesByAction(actionId = 'd84d8917-5fd3-4663-8105-66beaf7f2637'): Observable<Partial<Resource>[]> {
    return this.http
      .get<ResponseResult<Resource>>('/accountapp/v1.0/resources', { params: { actionId, size: 999 } })
      .pipe(map((response) => response.data.items));
  }
}
