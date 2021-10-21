import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseResponse, MY_TIME_API_PATH } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LeaveRequestPayload, PartialDaysType, RemainingLeaveEntitlement } from '../internal/models';

interface MyLeaveState {
  partialDayTypes: PartialDaysType[];
}

@Injectable()
export class MyLeaveService extends RxState<MyLeaveState> {
  readonly loggedInUserId = this.authService.get('userInfo', 'userId');

  constructor(private authService: AuthService, private http: HttpClient) {
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

  submitLeaveRequest(payload: LeaveRequestPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/leaves`, payload);
  }
}
