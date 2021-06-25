import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { TuiTime } from '@taiga-ui/cdk';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLeave } from '../../models/my-leave';
import { durationValues, PartialDays } from '../../models/submit-leave';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class MyLeaveService {
  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

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

  timeValue = [
    { value: 0, label: '08 : 00 : 00' },
    { value: 1, label: '08 : 05 : 00' },
    { value: 2, label: '08 : 10 : 00' },
    { value: 3, label: '08 : 15 : 00' },
    { value: 4, label: '08 : 20 : 00' },
    { value: 5, label: '08 : 25 : 00' },
    { value: 6, label: '08 : 30 : 00' },
    { value: 7, label: '08 : 35 : 00' },
    { value: 8, label: '08 : 40 : 00' },
    { value: 9, label: '08 : 45 : 00' },
    { value: 10, label: '08 : 50 : 00' },
    { value: 11, label: '08 : 55 : 00' },
    { value: 12, label: '09 : 00 : 00' },
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
        arrayTime.push({ value: i, label: time.toString('HH:MM:SS') });
        console.log('objCaculateHours', time.toString('HH:MM:SS'));
      } else {
        const increasedTime = time.shift({ hours: 0, minutes: objCaculateHours.addMinute, seconds: 0 });
        time = increasedTime;
        arrayTime.push({ value: i, label: time.toString('HH:MM:SS') });
        console.log('objCaculateHours', time.toString('HH:MM:SS'));
      }
    }
    return arrayTime;
  }

  getMyLeaves(pageIndex: number, pageSize: number): Observable<PagingResponse<MyLeave>> {
    const httpParams = new HttpParams();
    return this.httpClient.get<PagingResponse<MyLeave>>(`${MY_TIME_PATH}/leaves-all`, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLeave(id: string): Observable<any> {
    if (id === undefined || id == '') {
      return this.httpClient
        .get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/`, {})
        .pipe(map((res) => res as any));
    } else {
      return this.httpClient
        .get<MyLeave>(this.env.apiUrl + `${MY_TIME_PATH}/leaves/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  getLeaveType(): Observable<any> {
    return this.httpClient
      .get<any>(this.env.apiUrl + `${MY_TIME_PATH}/leave-type?name=`, {})
      .pipe(map((res) => res as any));
  }

  getdurations(): Observable<any> {
    return this.httpClient.get<any>(`${MY_TIME_PATH}/durations`, {}).pipe(map((res) => res as any));
  }

  getSendTo(): Observable<any> {
    return this.httpClient.get<any>(`${MY_ACCOUNT_PATH}/users`, {}).pipe(map((res) => res as any));
  }

  createLeave(body: any): Observable<any> {
    return this.httpClient.post<any>(`${MY_TIME_PATH}/leaves`, body);
  }

  editLeave(id: string | undefined, body: any): Observable<any> {
    return this.httpClient.put<any>(`${MY_TIME_PATH}/leaves/${id}`, body);
  }

  deleteLeave(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${MY_TIME_PATH}/leaves/${id}`);
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
