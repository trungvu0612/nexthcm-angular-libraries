import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { ACCOUNT_API_PATH, BaseResponse, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { TuiTime } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DurationHoldsEnum, HalfDaysEnum, PartialDay } from '../enums';
import {
  DurationValues,
  LeavesRemaining,
  LeaveSubmit,
  PartialDayType,
  SentToUser,
  SubmitLeavePayLoad,
} from '../models';

interface MyLeaveState {
  leaveTypeRemain: LeavesRemaining[];
  partialDayTypes: PartialDayType[];
}

@Injectable()
export class MyLeaveService extends RxState<MyLeaveState> {
  readonly loggedInUserId = this.authService.get('userInfo', 'userId');

  constructor(private authService: AuthService, private http: HttpClient) {
    super();
    this.connect('leaveTypeRemain', this.getLeaveTypes());
    this.connect('partialDayTypes', this.getPartialTypes());
  }

  durationValues: DurationValues[] = [
    {
      value: 0,
      label: 'Full Day',
    },
    {
      value: 1,
      label: 'Half Day',
    },
    {
      value: 2,
      label: 'Special Time',
    },
  ];

  durationFromPartial = [
    {
      value: 1,
      label: 'Half Day',
    },
    {
      value: 2,
      label: 'Special Time',
    },
  ];

  halfTime = [
    { value: 0, label: 'Morning', boolValue: true },
    { value: 1, label: 'Afternoon', boolValue: false },
  ];

  leaveSubmit: LeaveSubmit[] = [];

  strategies = new Map([
    //===
    [`${DurationHoldsEnum.FullDay}`, 'FULL_TIME'],
    [`${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    //!==
    [`${PartialDay.None}_${PartialDay.None}`, 'NONE'],

    [`${PartialDay.AllDays}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDay.AllDays}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDay.AllDays}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDay.StartDayOnly}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDay.StartDayOnly}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDay.StartDayOnly}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDay.EndDayOnly}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDay.EndDayOnly}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDay.EndDayOnly}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Morning}_${HalfDaysEnum.Morning}`, 'TWO_MORNING'],
    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Morning}_${HalfDaysEnum.Afternoon}`, 'MORNING_AFTERNOON'],
    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Afternoon}_${HalfDaysEnum.Afternoon}`, 'TWO_AFTERNOON'],
    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Afternoon}_${HalfDaysEnum.Morning}`, 'AFTERNOON_MORNING'],

    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Morning}_${DurationHoldsEnum.SpecialTime}`, 'MORNING_TIME'],
    [`${PartialDay.StartEndDay}_${HalfDaysEnum.Afternoon}_${DurationHoldsEnum.SpecialTime}`, 'AFTERNOON_TIME'],
    [`${PartialDay.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${HalfDaysEnum.Morning}`, 'TIME_MORNING'],
    [`${PartialDay.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${HalfDaysEnum.Afternoon}`, 'TIME_AFTERNOON'],
    [`${PartialDay.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${DurationHoldsEnum.SpecialTime}`, 'TIME_TIME'],
  ]);

  action(leaveSubmit: LeaveSubmit): [] | null {
    let condition =
      `${leaveSubmit.partialDays?.type === 0 ? '0' : ''}` +
      `${leaveSubmit.partialDays?.type === 0 ? '_0' : ''}` +
      `${leaveSubmit.partialDays?.type === 1 ? '1' : ''}` +
      `${leaveSubmit.partialDays?.type === 2 ? '2' : ''}` +
      `${leaveSubmit.partialDays?.type === 3 ? '3' : ''}` +
      `${leaveSubmit.partialDays?.type === 4 ? '4' : ''}` +
      `${leaveSubmit.durationHold === 0 ? '_-1' : ''}` +
      `${leaveSubmit.durationHold === 1 ? '' : ''}` +
      `${leaveSubmit.durationHold === 2 ? '_2' : ''}` +
      `${leaveSubmit.halfDay === 0 ? '_0' : ''}` +
      `${leaveSubmit.halfDay === 1 ? '_1' : ''}` +
      `${leaveSubmit.durationEnd === 1 ? '' : ''}` +
      `${leaveSubmit.durationEnd === 2 ? '_2' : ''}` +
      `${leaveSubmit.halfDay2 === 0 ? '_0' : ''}` +
      `${leaveSubmit.halfDay2 === 1 ? '_1' : ''}`;

    if (condition.charAt(0) === '_') {
      condition = condition.substring(1);
    }
    const strategy = this.strategies.get(condition.trim());

    let items: any[] | null = [];

    if (strategy !== 'FULL_TIME') {
      if (strategy === 'ONLY_MORNING') {
        items = [
          {
            morning: true,
          },
        ];
      } else if (strategy === 'ONLY_AFTERNOON') {
        items = [
          {
            afternoon: true,
          },
        ];
      } else if (strategy === 'ONLY_TIME') {
        items = [
          {
            fromTime: leaveSubmit.specialTimeFrom,
            toTime: leaveSubmit.specialTimeTo,
          },
        ]; /*TIME BEGIN*/
      } else if (strategy === 'TWO_MORNING') {
        items = [{ morning: true }, { morning: true }];
      } else if (strategy === 'TWO_AFTERNOON') {
        items = [{ afternoon: true }, { afternoon: true }];
      } else if (strategy === 'MORNING_AFTERNOON') {
        items = [{ morning: true }, { afternoon: true }];
      } else if (strategy === 'AFTERNOON_MORNING') {
        items = [{ afternoon: true }, { morning: true }];
      } else if (strategy === 'MORNING_TIME') {
        items = [
          { morning: true },
          {
            fromTime: leaveSubmit.specialTimeFrom2,
            toTime: leaveSubmit.specialTimeTo2,
          },
        ];
      } else if (strategy === 'AFTERNOON_TIME') {
        items = [
          { afternoon: true },
          {
            fromTime: leaveSubmit.specialTimeFrom2,
            toTime: leaveSubmit.specialTimeTo2,
          },
        ];
      } else if (strategy === 'TIME_MORNING') {
        items = [
          {
            fromTime: leaveSubmit.specialTimeFrom,
            toTime: leaveSubmit.specialTimeTo,
          },
          { morning: true },
        ];
      } else if (strategy === 'TIME_AFTERNOON') {
        items = [
          {
            fromTime: leaveSubmit.specialTimeFrom,
            toTime: leaveSubmit.specialTimeTo,
          },
          { afternoon: true },
        ];
      } else if (strategy === 'TIME_TIME') {
        items = [
          {
            fromTime: leaveSubmit.specialTimeFrom,
            toTime: leaveSubmit.specialTimeTo,
          },
          {
            fromTime: leaveSubmit.specialTimeFrom2,
            toTime: leaveSubmit.specialTimeTo2,
          },
        ];
      } else if (strategy === 'NONE') {
        return null;
      }
    } else {
      return null;
    }
    return items as [];
  }

  shiftTimeHours(): any[] {
    const arrayTime = [];
    const objCaculateHours = {
      hours: 7,
      minutes: 45,
      seconds: 0,
      addMinute: 15,
    };

    let time = new TuiTime(objCaculateHours.hours, objCaculateHours.minutes, objCaculateHours.seconds);
    for (let i = 0; i < 41; i++) {
      if (time.minutes == 45) {
        objCaculateHours.hours++;
        time = new TuiTime(objCaculateHours.hours, 0, 0);
        arrayTime.push({
          value: i,
          label: time.toString('HH:MM') > '12' ? time.toString('HH:MM') : time.toString('HH:MM'),
          time: time,
          conVertToSecond: time.toAbsoluteMilliseconds() / 1000,
        });
      } else {
        time = time.shift({ hours: 0, minutes: objCaculateHours.addMinute, seconds: 0 });
        arrayTime.push({
          value: i,
          label: time.toString('HH:MM') > '12' ? time.toString('HH:MM') : time.toString('HH:MM'),
          time: time,
          conVertToSecond: time.toAbsoluteMilliseconds() / 1000,
        });
      }
    }
    return arrayTime;
  }

  getLeaveTypes(): Observable<LeavesRemaining[]> {
    return this.http
      .get<BaseResponse<LeavesRemaining[]>>(
        `${MY_TIME_API_PATH}/leaves/remaining-entitlement-by-user-id/${this.loggedInUserId}`
      )
      .pipe(map((res) => res.data));
  }

  getPartialTypes(): Observable<PartialDayType[]> {
    return this.http
      .get<BaseResponse<PartialDayType[]>>(`${MY_TIME_API_PATH}/partial-day-type/`)
      .pipe(map((res) => res.data));
  }

  getSendToUsers(): Observable<PagingResponse<SentToUser>> {
    return this.http.get<PagingResponse<SentToUser>>(`${ACCOUNT_API_PATH}/users`);
  }

  createLeave(body: SubmitLeavePayLoad): Observable<unknown> {
    return this.http.post<unknown>(`${MY_TIME_API_PATH}/leaves`, body);
  }

  editLeave(id: string | undefined, body: any): Observable<any> {
    return this.http.put<any>(`${MY_TIME_API_PATH}/leaves/${id}`, body);
  }

  deleteLeave(id: string): Observable<any> {
    return this.http.delete<any>(`${MY_TIME_API_PATH}/leaves/${id}`);
  }

  getdurationValues(): Observable<any[]> {
    return of(this.durationValues);
  }

  getTimeValues(): Observable<any[]> {
    return of(this.shiftTimeHours());
  }

  getHalfTime(): Observable<any[]> {
    return of(this.halfTime);
  }
}
