import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { LeaveType, SearchLeaveType } from '../models/leave-type';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private httpClient: HttpClient
  ) {
  }

  getLeaveTypes(pageIndex: number, pageSize: number, search: SearchLeaveType): Observable<PagingResponse<LeaveType>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchLeaveType]);
    });
    return this.httpClient.get<PagingResponse<LeaveType>>(this.appVersion + '/leave-type', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
    });
  }

  getLeaveType(id: string): Observable<LeaveType> {
    return this.httpClient
      .get<LeaveType>(this.appVersion + '/leave-type' + '/' + id);
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient.post<LeaveType>(this.appVersion + '/leave-type', dto);
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient.put<LeaveType>(this.appVersion + `/leave-type/${id}`, dto);
  }
}
