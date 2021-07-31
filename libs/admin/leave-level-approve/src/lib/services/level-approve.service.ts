import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JobTitle } from '@nexthcm/admin-job-titles';
import { APP_CONFIG, AppConfig, Pagination, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LevelApprove } from '../models/level-approve';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable()
export class LevelApproveService {

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private http: HttpClient) {}

  getJobTitles(params: { [key: string]: number }): Observable<Pagination<JobTitle>> {
    return this.http
      .get<PagingResponse<JobTitle>>('/accountapp/v1.0/titles', { params })
      .pipe(map((response) => response.data));
  }

  getLeaveTypes(params: { [key: string]: number }): Observable<Pagination<any>> {
    return this.http
      .get<PagingResponse<any>>(`${MY_TIME_PATH}/leaveTypes`, { params })
      .pipe(map((response) => response.data));
  }


  getAdminLevelApproves(pageIndex: number, pageSize: number): Observable<PagingResponse<LevelApprove>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<LevelApprove>>(`${MY_TIME_PATH}/leave-level-approve/`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getAdminLevelApproveId(id: LevelApprove | string): Observable<LevelApprove> {
    if (id === undefined || id === '') {
      return this.http.get<LevelApprove>(this.env.apiUrl + `${MY_TIME_PATH}/leave-level-approve/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<LevelApprove>(this.env.apiUrl + `${MY_TIME_PATH}/leave-level-approve/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createAdminLevelApproveId(body: any): Observable<LevelApprove> {
    return this.http.post<LevelApprove>(`${MY_TIME_PATH}/leave-level-approve`, body);
  }

  editAdminLevelApproveId(id: string | undefined, body: any): Observable<LevelApprove> {
    return this.http.put<LevelApprove>(`${MY_TIME_PATH}/leave-level-approve/${id}`, body);
  }

  deleteAdminLevelApproveId(id: string): Observable<LevelApprove> {
    return this.http.delete<LevelApprove>(`${MY_TIME_PATH}/leave-level-approve/${id}`);
  }

}
