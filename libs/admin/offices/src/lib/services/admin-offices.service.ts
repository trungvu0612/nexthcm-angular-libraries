import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, Pagination, PagingResponse, Zone } from '@nexthcm/cdk';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Office } from '../models/office';

const ACCOUNT_APP_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root'
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {
  }


  getOffices(params: HttpParams): Observable<Pagination<Office>> {
    return this.http.get<PagingResponse<Office>>(`${ACCOUNT_API_PATH}/offices/v2`, { params }).pipe(
      map((res) => res.data),
      catchError(() => EMPTY)
    );
  }

  createOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.post(ACCOUNT_APP_PATH + '/offices', body);
  }

  editOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.put(ACCOUNT_APP_PATH + '/offices/' + body.id, body);
  }

  deleteOffice(id: string): Observable<any> {
    return this.http.delete(`${ACCOUNT_APP_PATH}/offices/${id}`, {});
  }
}
