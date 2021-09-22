import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseObject, MY_TIME_API_PATH, Pagination, PagingResponse, Zone } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminSeatMapsService extends RxState<{ offices: Partial<Zone>[] }> {
  constructor(private http: HttpClient) {
    super();
    this.connect(
      'offices',
      this.http
        .get<PagingResponse<Zone>>(`${ACCOUNT_API_PATH}/offices`, { params: { size: 999 } })
        .pipe(map((response) => response.data.items))
    );
  }

  getSeatMaps(params: HttpParams): Observable<Pagination<Zone>> {
    return this.http
      .get<PagingResponse<Zone>>(`${MY_TIME_API_PATH}/seats-map`, { params })
      .pipe(map((res) => res.data));
  }

  getSeatMap(id: string): Observable<Partial<Zone>> {
    return this.http.get<Partial<Zone>>(`${MY_TIME_API_PATH}/seats-map/${id}`);
  }

  createSeatMap(body: Partial<Zone>): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/seats-map`, body);
  }

  editSeatMap(body: Partial<Zone>): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/seats-map/${body.id}`, body);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${MY_TIME_API_PATH}/seats-map/${id}`, {});
  }

  getOfficesSearch(searchQuery?: string): Observable<Pagination<Partial<BaseObject>>> {
    return this.http
      .get<PagingResponse<Partial<BaseObject>>>(`${ACCOUNT_API_PATH}/offices/v2?search=${searchQuery}`)
      .pipe(map((response) => response.data.items as any));
  }
}
