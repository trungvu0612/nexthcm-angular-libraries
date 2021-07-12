import { BranchList } from '../models/branch';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, AppConfig, Pagination, PagingResponse } from '@nexthcm/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  appVersion = this.env.apiUrl + '/accountapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig,
              private httpClient: HttpClient) {}

  getBranchData(params: { page?: number; size?: number }):  Observable<Pagination<BranchList>> {
    return this.httpClient
      .get<PagingResponse<BranchList>>(this.appVersion + '/orgs', { params })
      .pipe(map(response => response.data));
  }

  getBranchDatas(pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/orgs', {
      params: new HttpParams()
        // .set('orgType', 'BRA')
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  get(id: string): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + `/orgs/${id}`).pipe(map((data) => data as any));
  }

  // create(dto: LeaveType): Observable<LeaveType> {
  //   return this.httpClient.post<LeaveType>(this.appVersion + '/leave-type', dto);
  // }
  //
  // edit(dto: LeaveType, id: string): Observable<LeaveType> {
  //   return this.httpClient.put<LeaveType>(this.appVersion + `/leave-type/${id}`, dto);
  // }

  // getListTests(params: HttpParams): Observable<PagingResponse<BranchRes>> {
  //   return this.httpClient
  //     .post<PagingResponse<BranchRes>>(`/promotion/admin/list`, null, { params })
  //     .pipe(catchError(() => EMPTY));
  // }

  // formlyEdit(): Observable<any> {
  //   return of({
  //     id: 1,
  //     image: 'assets/icons/bulding.svg',
  //     name: 'Copac Square',
  //     address: '12 Ton Dan St., Dist 4., HCMC, Vietnam',
  //     obj: {
  //       nameObj: 'dfsdf',
  //     },
  //   });
  // }
}
