import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseResponse, PagingResponse, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiTime } from '@taiga-ui/cdk';
import { from, iif, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { DurationHoldsEnum, PartialDaysEnum } from '../enums';
import { HalfDaysEnum } from '../enums/half-days';
import { DurationValues, LeavesRemaining, LeaveSubmit, MyLeave, PartialDayType, Requests, SentToUser } from '../models';
import { RequestTypeAPIUrlPath } from './my-time.service';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const MY_ACCOUNT_PATH = '/accountapp/v1.0';

interface MyLeaveState {
  leaveTypeRemain: LeavesRemaining[];
  sendToUsers: SentToUser[];
  partialDayTypes: PartialDayType[];
}

@Injectable()
export class MyLeaveService extends RxState<MyLeaveState> {
  readonly loggedInUserId = this.authService.get('userInfo', 'userId');

  constructor(private authService: AuthService,
              private http: HttpClient,
              private promptService: PromptService,
              private translocoService: TranslocoService
  ) {
    super();
    this.connect('leaveTypeRemain', this.getLeaveTypes());
    this.connect('partialDayTypes', this.getPartialTypes());
    this.connect('sendToUsers', this.getSendToUsers().pipe(map((res) => res.data.items)));
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
    [`${PartialDaysEnum.None}_${PartialDaysEnum.None}`, 'NONE'],

    [`${PartialDaysEnum.AllDays}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDaysEnum.AllDays}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDaysEnum.AllDays}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDaysEnum.StartDayOnly}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDaysEnum.StartDayOnly}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDaysEnum.StartDayOnly}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDaysEnum.EndDayOnly}_${HalfDaysEnum.Morning}`, 'ONLY_MORNING'],
    [`${PartialDaysEnum.EndDayOnly}_${HalfDaysEnum.Afternoon}`, 'ONLY_AFTERNOON'],
    [`${PartialDaysEnum.EndDayOnly}_${DurationHoldsEnum.SpecialTime}`, 'ONLY_TIME'],

    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Morning}_${HalfDaysEnum.Morning}`, 'TWO_MORNING'],
    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Morning}_${HalfDaysEnum.Afternoon}`, 'MORNING_AFTERNOON'],
    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Afternoon}_${HalfDaysEnum.Afternoon}`, 'TWO_AFTERNOON'],
    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Afternoon}_${HalfDaysEnum.Morning}`, 'AFTERNOON_MORNING'],

    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Morning}_${DurationHoldsEnum.SpecialTime}`, 'MORNING_TIME'],
    [`${PartialDaysEnum.StartEndDay}_${HalfDaysEnum.Afternoon}_${DurationHoldsEnum.SpecialTime}`, 'AFTERNOON_TIME'],
    [`${PartialDaysEnum.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${HalfDaysEnum.Morning}`, 'TIME_MORNING'],
    [`${PartialDaysEnum.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${HalfDaysEnum.Afternoon}`, 'TIME_AFTERNOON'],
    [`${PartialDaysEnum.StartEndDay}_${DurationHoldsEnum.SpecialTime}_${DurationHoldsEnum.SpecialTime}`, 'TIME_TIME'],
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
    console.log('condition', condition);
    console.log('strategy', strategy);

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
          label:
            time.toString('HH:MM') > '12' ? time.toString('HH:MM') : time.toString('HH:MM'),
          time: time,
          conVertToSecond: time.toAbsoluteMilliseconds() / 1000,
        });
      } else {
        const increasedTime = time.shift({ hours: 0, minutes: objCaculateHours.addMinute, seconds: 0 });
        time = increasedTime;
        arrayTime.push({
          value: i,
          label:
            time.toString('HH:MM') > '12' ? time.toString('HH:MM') : time.toString('HH:MM'),
          time: time,
          conVertToSecond: time.toAbsoluteMilliseconds() / 1000,
        });
      }
    }
    return arrayTime;
  }

  getMyLeaves(pageIndex: number, pageSize: number): Observable<PagingResponse<MyLeave>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<MyLeave>>(`${MY_TIME_PATH}/leaves`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('sort', 'createdDate')
        .set('createdDate.dir', 'des'),
    });
  }


  getLeaves(params: HttpParams): Observable<PagingResponse<MyLeave>> {
    return this.http.get<PagingResponse<MyLeave>>(`${MY_TIME_PATH}/leaves/`, { params });
  }

  getLeaveTypes(): Observable<LeavesRemaining[]> {
    return this.http
      .get<any>(`${MY_TIME_PATH}/leaves/remaining-entitlement-by-user-id/${this.loggedInUserId}`)
      .pipe(map((res) => res.data as LeavesRemaining[]));
  }

  getPartialTypes(): Observable<PartialDayType[]> {
    return this.http
      .get<BaseResponse<PartialDayType[]>>(`${MY_TIME_PATH}/partial-day-type/`)
      .pipe(map((res) => res.data));
  }

  cancelRequest(id: string, callback?: () => void): Observable<unknown> {
    return from(
      this.promptService.open({
        icon: 'warning',
        showCancelButton: true,
        html: this.translocoService.translate('cancelRequestWarning'),
      } as SweetAlertOptions)
    ).pipe(
      switchMap((result) => iif(() => result.isConfirmed, this.editLeave(id, { status: 2 }))),
      tap(this.promptService.handleResponse('cancelSuccessfully', callback))
    );
  }

  getSendToUsers(): Observable<PagingResponse<SentToUser>> {
    return this.http.get<PagingResponse<SentToUser>>(`${MY_ACCOUNT_PATH}/users`);
  }

  createLeave(body: any): Observable<any> {
    return this.http.post<any>(`${MY_TIME_PATH}/leaves`, body);
  }

  editLeave(id: string | undefined, body: any): Observable<any> {
    return this.http.put<any>(`${MY_TIME_PATH}/leaves/${id}`, body);
  }

  deleteLeave(id: string): Observable<any> {
    return this.http.delete<any>(`${MY_TIME_PATH}/leaves/${id}`);
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

  getRequestDetail(id?: string): Observable<any> {
    return this.http.get<Requests>(`${MY_TIME_PATH}/leaves/` + id);
  }
}
