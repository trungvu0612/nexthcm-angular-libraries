import {Inject, Injectable} from '@angular/core';
import {LeaveTypeState, LeaveTypeStore} from "../state/leave-type/leave-type.store";
import {PaginatorPlugin} from "@datorama/akita";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LEAVE_TYPE_PAGINATOR} from "../state/leave-type/leave-type.paginator";
import {Observable} from "rxjs";
import {LeaveType} from "../models/leave-type";
import {environment} from "../../../../../apps/hcm-web/src/environments/environment";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

  appVersion: string = '/mytimeapp/v1.0';

  constructor(
    private leaveTypeStore: LeaveTypeStore,
    private httpClient: HttpClient,
    @Inject(LEAVE_TYPE_PAGINATOR) public paginatorRef: PaginatorPlugin<LeaveTypeState>
  ) {
  }

  getLeaveTypes(pageIndex: number, pageSize: number): Observable<any> {
    let httpParams = new HttpParams();
    return this.httpClient.get<any>(  this.appVersion + '/leave-type', {
      params: httpParams.set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
    });
  }

  getLeaveType(id: string): Observable<LeaveType> {
    return this.httpClient
      .get<LeaveType>(this.appVersion + '/leave-type' + '/' + id)
      .pipe(tap((truckYard) => this.leaveTypeStore.upsert(id, truckYard)));
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient
      .post<LeaveType>( this.appVersion + '/leave-type', dto)
      .pipe(tap((leaveType) => {
        this.paginatorRef.clearCache({ clearStore: true });
      }));
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient
      .put<LeaveType>( this.appVersion + `/leave-type/${id}`, dto)
      .pipe(tap((leaveType) => {
        this.paginatorRef.clearCache({ clearStore: true });
      }));
  }
}
