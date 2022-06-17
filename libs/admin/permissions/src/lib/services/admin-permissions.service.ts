import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { combineLatest, exhaustMap, Observable, Subject, take } from 'rxjs';
import { filter, map, share, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { Item, Policy } from '../models/policy';

interface State {
  services: Item[];
  actions: Item[];
  resources: Record<string, Item[]>;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionsService extends RxState<State> {
  readonly init$ = new Subject<void>();
  readonly request$ = this.select().pipe(
    startWith(null),
    filter((value): value is State => {
      if (value === null) this.init$.next();
      return value !== null;
    }),
    share()
  );

  readonly services$ = this.request$.pipe(
    map(({ services }) => services),
    shareReplay(1)
  );
  readonly actions$ = this.request$.pipe(
    map(({ actions }) => actions),
    shareReplay(1)
  );
  readonly resources$ = this.request$.pipe(
    map(({ resources }) => resources),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {
    super();
    this.connect(
      this.init$.pipe(
        exhaustMap(() => combineLatest([this.getServicesOrActions('services'), this.getServicesOrActions('actions')])),
        take(1),
        switchMap(([services, actions]) => {
          // TODO spelling mistake
          actions.forEach((action) => {
            if (action.code === 'APPRROVE') action.code = 'APPROVE';
          });
          return combineLatest(actions.map(({ id }) => this.getResourcesByAction(id))).pipe(
            map((resources) => {
              const result: Record<string, Item[]> = {};
              actions.forEach(({ code }, index) => (result[code] = resources[index]));
              return { services, actions, resources: result };
            })
          );
        })
      )
    );
  }

  getResourcesByAction(actionId: string): Observable<Item[]> {
    return this.http
      .get<PagingResponse<Item>>(`${ACCOUNT_API_PATH}/resources`, { params: { actionId, size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getPermissions(params: HttpParams): Observable<Pagination<Policy>> {
    return this.http
      .get<PagingResponse<Policy>>(`${ACCOUNT_API_PATH}/permissions`, { params })
      .pipe(map((response) => response.data));
  }

  getPermission(policyId: string): Observable<Policy> {
    return this.http.get<Policy>(`${ACCOUNT_API_PATH}/permissions/` + policyId);
  }

  upsertPermission(body: Policy): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/permissions`, body);
  }

  deletePermission(id: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/permissions/${id}`, {});
  }

  private getServicesOrActions(type: 'services' | 'actions'): Observable<Item[]> {
    return this.http
      .get<PagingResponse<Item>>(`${ACCOUNT_API_PATH}/` + type, { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }
}
