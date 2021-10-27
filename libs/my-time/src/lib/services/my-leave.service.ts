import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LeaveRequestPayload, PartialDaysType, RemainingLeaveEntitlement } from '../internal/models';
import { MaximumLeaveEntitlementsCanConvert } from '../internal/models/maximum-leave-entitlements-can-convert';
import { ConvertLeaveEntitlementPayload } from '../internal/models/requests/convert-leave-entitlement-payload';

interface MyLeaveState {
  partialDayTypes: PartialDaysType[];
}

@Injectable()
export class MyLeaveService extends RxState<MyLeaveState> {
  private refreshSubject = new Subject();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('partialDayTypes', this.getPartialTypes());
  }

  getPartialTypes(): Observable<PartialDaysType[]> {
    return this.http
      .get<BaseResponse<PartialDaysType[]>>(`${MY_TIME_API_PATH}/partial-day-type`)
      .pipe(map((res) => res.data));
  }

  getEmployeeLeaveEntitlements(userId: string): Observable<RemainingLeaveEntitlement[]> {
    return this.http
      .get<BaseResponse<RemainingLeaveEntitlement[]>>(
        `${MY_TIME_API_PATH}/leaves/remaining-entitlement-by-user-id/${userId}`
      )
      .pipe(
        map((res) => res.data),
        catchError(() => of([]))
      );
  }

  getEmployeeLeaveEntitlementsForConverting(userId: string): Observable<RemainingLeaveEntitlement[]> {
    return this.http
      .get<BaseResponse<RemainingLeaveEntitlement[]>>(
        `${MY_TIME_API_PATH}/remaining-entitlement-transfer-by-user-id/${userId}`
      )
      .pipe(
        map((res) => res.data),
        catchError(() => of([]))
      );
  }

  submitLeaveRequest(payload: LeaveRequestPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/leaves`, payload).pipe(tap(() => this.refreshSubject.next()));
  }

  submitConvertLeaveEntitlementsRequest(payload: ConvertLeaveEntitlementPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/leave-entitlement-transfer`, payload);
  }

  getMaximumLeaveEntitlementsCanConvert(): Observable<MaximumLeaveEntitlementsCanConvert> {
    return this.http
      .get<BaseResponse<MaximumLeaveEntitlementsCanConvert>>(
        `${MY_TIME_API_PATH}/leave-entitlement-transfer/max-min-paid-leave-transfer`
      )
      .pipe(map((res) => res.data));
  }
}
