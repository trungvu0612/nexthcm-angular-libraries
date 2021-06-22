import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@nexthcm/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action, Policy, Resource, Service } from '../models/policy';

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionsService {
  constructor(private http: HttpClient) {}

  getPolicies(): Observable<Partial<Policy>[]> {
    return this.http.get<Response<Policy>>('/accountapp/v1.0/permissions').pipe(map((response) => response.data.items));
  }

  getServices(): Observable<Partial<Service>[]> {
    return this.http
      .get<Response<Service>>('/accountapp/v1.0/services', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getActions(): Observable<Partial<Action>[]> {
    return this.http
      .get<Response<Action>>('/accountapp/v1.0/actions', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getResourcesByAction(actionId = 'd84d8917-5fd3-4663-8105-66beaf7f2637'): Observable<Partial<Resource>[]> {
    return this.http
      .get<Response<Resource>>('/accountapp/v1.0/resources', { params: { actionId, size: 999 } })
      .pipe(map((response) => response.data.items));
  }
}
