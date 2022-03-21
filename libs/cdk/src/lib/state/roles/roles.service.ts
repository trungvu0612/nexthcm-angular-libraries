import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, PagingResponse } from '../../models';

interface RolesState {
  roles: BaseObject[];
}

@Injectable({
  providedIn: 'root',
})
export class RolesService extends RxState<RolesState> {
  readonly roles$ = this.select('roles');
  private readonly loadRoles$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('roles', this.loadRoles$.pipe(switchMap(() => this.getRoles())));
  }

  getRoles(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/roles/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }

  doLoadRoles(): void {
    if (!this.get('roles')) {
      this.loadRoles$.next();
    }
  }

  doRefreshRoles(): void {
    if (this.get('roles')) {
      this.loadRoles$.next();
    }
  }
}
