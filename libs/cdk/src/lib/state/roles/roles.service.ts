import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject, PagingResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private readonly http: HttpClient) {}

  getRoles(): Observable<BaseObject[]> {
    return this.http.get<PagingResponse<BaseObject>>(`${ACCOUNT_API_PATH}/roles/v2`).pipe(
      map((res) => res.data.items),
      catchError(() => of([]))
    );
  }
}
