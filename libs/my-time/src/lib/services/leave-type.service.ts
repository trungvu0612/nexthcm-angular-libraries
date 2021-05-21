import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { ENVIRONMENT, Environment } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LeaveType } from '../models/leave-type';
import { LEAVE_TYPE_PAGINATOR } from '../state/leave-type/leave-type.paginator';
import { LeaveTypeState, LeaveTypeStore } from '../state/leave-type/leave-type.store';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private leaveTypeStore: LeaveTypeStore,
    private httpClient: HttpClient,
    @Inject(LEAVE_TYPE_PAGINATOR) public paginatorRef: PaginatorPlugin<LeaveTypeState>
  ) {}

  getLeaveTypes(pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/leave-type', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLeaveType(id: string): Observable<LeaveType> {
    return this.httpClient
      .get<LeaveType>(this.appVersion + '/leave-type' + '/' + id)
      .pipe(tap((truckYard) => this.leaveTypeStore.upsert(id, truckYard)));
  }

  createLeaveType(dto: LeaveType): Observable<LeaveType> {
    return this.httpClient.post<LeaveType>(this.appVersion + '/leave-type', dto).pipe(
      tap(() => {
        this.paginatorRef.clearCache({ clearStore: true });
      })
    );
  }

  editLeaveType(dto: LeaveType, id: string): Observable<LeaveType> {
    return this.httpClient.put<LeaveType>(this.appVersion + `/leave-type/${id}`, dto).pipe(
      tap(() => {
        this.paginatorRef.clearCache({ clearStore: true });
      })
    );
  }
}
