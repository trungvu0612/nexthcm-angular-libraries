import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLeave } from '../../models/my-leave';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root'
})
export class MyLeaveService {

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private httpClient: HttpClient
  ) {
  }

  getMyLeaves(pageIndex: number, pageSize: number): Observable<PagingResponse<MyLeave>> {
    const httpParams = new HttpParams();
    return this.httpClient.get<PagingResponse<MyLeave>>(`${MY_TIME_PATH}/leaves-all`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
    });
  }

  getLeave(id: string): Observable<any> {
    if (id === undefined || id == '') {
      return this.httpClient
        .get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/`, {})
        .pipe(map((res) => res as any));
    } else {
      return this.httpClient
        .get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  getLeaveType(): Observable<any> {
    return this.httpClient
      .get<any>(this.env.apiUrl + `${MY_TIME_PATH}/leave-type?name=`, {})
      .pipe(map((res) => res as any));
  }

  getdurations(): Observable<any> {
    return this.httpClient
      .get<any>(`${MY_TIME_PATH}/durations`, {})
      .pipe(map((res) => res as any));
  }

  getSendTo(): Observable<any> {
    return this.httpClient
      .get<any>(`${MY_ACCOUNT_PATH}/users`, {})
      .pipe(map((res) => res as any));
  }

  createLeave(body: any): Observable<any> {
    return this.httpClient.post<any>( `${MY_TIME_PATH}/leaves`, body);
  }

  editLeave(id: string, body: any): Observable<any> {
    return this.httpClient.put<any>( `${MY_TIME_PATH}/leaves/${id}`, body);
  }

  deleteLeave(id: string): Observable<any> {
    return this.httpClient.delete<any>( `${MY_TIME_PATH}/leaves/${id}`);
  }

}


