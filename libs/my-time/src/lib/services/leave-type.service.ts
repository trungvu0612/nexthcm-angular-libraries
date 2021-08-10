import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { LeaveType, SearchLeaveType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getLeaveTypes(pageIndex: number, pageSize: number, search: SearchLeaveType): Observable<PagingResponse<LeaveType>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchLeaveType]);
    });
    return this.httpClient.get<PagingResponse<LeaveType>>(this.appVersion + '/leave-type', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLeaveType(id: string): Observable<LeaveType> {
    return this.httpClient.get<LeaveType>(this.appVersion + '/leave-type' + '/' + id);
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient.post<LeaveType>(this.appVersion + '/leave-type', dto);
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient.put<LeaveType>(this.appVersion + `/leave-type/${id}`, dto);
  }
}
