import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse, Zone } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const ACCOUNT_APP_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class AdminOfficesService {
  constructor(private http: HttpClient) {}

  getOffices(params: { [key: string]: number }): Observable<Pagination<Zone>> {
    return this.http
      .get<PagingResponse<Zone>>(ACCOUNT_APP_PATH + '/offices', { params })
      .pipe(map((response) => response.data));
  }

  createOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.post(ACCOUNT_APP_PATH + '/offices', body);
  }

  editOffice(body: Partial<Zone>): Observable<Partial<Zone>> {
    return this.http.put(ACCOUNT_APP_PATH + '/offices/' + body.id, body);
  }
}
