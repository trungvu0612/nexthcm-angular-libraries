import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { TuiTime } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeavesRemaining } from '../models/leave-type';
import { MyLeave } from '../models/my-leave';
import { SentToUser } from '../models/send-to-user';
import { durationValues, PartialDays } from '../models/submit-leave';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const MY_ACCOUNT_PATH = '/accountapp/v1.0';

interface MyLeaveState {
  leaveTypeRemain: LeavesRemaining[];
  sendToUsers: SentToUser[];
}

@Injectable()
export class MyLeaveService extends RxState<MyLeaveState> {
  readonly loggedInUserId = this.authService.get('userInfo', 'userId')

  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private authService: AuthService,
    private http: HttpClient) {
    super();
    this.connect('leaveTypeRemain', this.getLeaveTypes());
    this.connect('sendToUsers', this.getSendToUsers().pipe(map((res) => res.data.items)));
  }

  partialDays: PartialDays[] = [
    {
      value: 0,
      label: 'NONE',
    },
    {
      value: 1,
      label: 'All Days',
    },
    {
      value: 2,
      label: 'Start Day Only',
    },
    {
      value: 3,
      label: 'End Day Only',
    },
    {
      value: 4,
      label: 'Start and End Day',
    },
  ];

  durationValues: durationValues[] = [
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
    { value: 0, label: 'Morning' },
    { value: 1, label: 'Afternoon' },
  ];

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
            time.toString('HH:MM:SS') > '12' ? time.toString('HH:MM:SS') + ' PM' : time.toString('HH:MM:SS') + ' AM',
          time: time,
        });
        console.log('objCaculateHours', time.toString('HH:MM:SS'));
      } else {
        const increasedTime = time.shift({ hours: 0, minutes: objCaculateHours.addMinute, seconds: 0 });
        time = increasedTime;
        arrayTime.push({
          value: i,
          label:
            time.toString('HH:MM:SS') > '12' ? time.toString('HH:MM:SS') + ' PM' : time.toString('HH:MM:SS') + ' AM',
          time: time,
        });
        console.log('objCaculateHours', time.toString('HH:MM:SS'));
      }
    }
    return arrayTime;
  }

  getMyLeaves(pageIndex: number, pageSize: number): Observable<PagingResponse<MyLeave>> {
    const httpParams = new HttpParams();
    return this.http.get<PagingResponse<MyLeave>>(`${MY_TIME_PATH}/leaves`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLeave(id: string): Observable<any> {
    if (id === undefined || id == '') {
      return this.http.get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/`, {}).pipe(map((res) => res as any));
    } else {
      return this.http
        .get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  getLeaveTypes(): Observable<LeavesRemaining[]> {
    return this.http.get<any>(`${MY_TIME_PATH}/leaves/remaining-entitlement-by-user-id/${this.loggedInUserId}`).pipe(map((res) => res.data as LeavesRemaining[]));
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

  getPartialDays(): Observable<any[]> {
    return of(this.partialDays);
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
