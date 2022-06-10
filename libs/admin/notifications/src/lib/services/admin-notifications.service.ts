import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseResponse,
  DEFAULT_PAGINATION_DATA,
  EmailVariable,
  Pagination,
  PagingResponse,
  SCHEDULER_API_PATH,
} from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Application } from '../models/application';
import { NotificationConfigItem, NotificationConfigResponse } from '../models/notification-config';
import { NotificationItem } from '../models/notification-item';
import { NotificationSettingItem, NotificationSettingResponse } from '../models/notification-setting';

interface AdminNotificationsState {
  emailVariables: EmailVariable[];
  configNotifications: NotificationConfigItem[];
  settingNotifications: NotificationSettingResponse;
}

@Injectable()
export class AdminNotificationsService extends RxState<AdminNotificationsState> {
  readonly emailVariables$ = this.select('emailVariables');
  readonly configNotifications$ = this.select('configNotifications');
  readonly settingNotifications$ = this.select('settingNotifications');
  private readonly loadEmailVariables$ = new Subject<void>();
  private readonly loadConfigNotifications$ = new Subject<void>();
  private readonly loadSettingNotifications$ = new Subject<void>();
  constructor(private readonly http: HttpClient) {
    super();
    this.connect(
      'emailVariables',
      this.loadEmailVariables$.pipe(switchMap(() => this.getNotificationEmailVariables()))
    );
    this.connect(
      'configNotifications',
      this.loadConfigNotifications$.pipe(switchMap(() => this.getConfigNotifications()))
    );
    this.connect(
      'settingNotifications',
      this.loadSettingNotifications$.pipe(switchMap(() => this.getSettingNotifications()))
    );
  }

  getNotifications(params: HttpParams): Observable<Pagination<NotificationItem>> {
    return this.http.get<PagingResponse<NotificationItem>>(`${SCHEDULER_API_PATH}/notification/get`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of(DEFAULT_PAGINATION_DATA))
    );
  }

  getConfigNotifications(): Observable<NotificationConfigItem[]> {
    return this.http
      .get<NotificationConfigResponse<NotificationConfigItem>>(`${SCHEDULER_API_PATH}/notify/list-config`)
      .pipe(map((res) => res.listNotifiConfig));
  }

  getSettingNotifications(): Observable<NotificationSettingResponse> {
    return this.http
      .get<NotificationSettingResponse>(`${SCHEDULER_API_PATH}/notify/list-setting`)
      .pipe(map((res) => res));
  }

  getNotification(notificationId: string): Observable<NotificationItem> {
    return this.http
      .get<BaseResponse<NotificationItem>>(`${SCHEDULER_API_PATH}/notification/${notificationId}`)
      .pipe(map((res) => res.data));
  }

  createNotification(payload: NotificationItem): Observable<unknown> {
    return this.http.post(`${SCHEDULER_API_PATH}/notification/create`, payload);
  }

  updateNotification(payload: NotificationItem): Observable<unknown> {
    return this.http.put(`${SCHEDULER_API_PATH}/notification/edit`, payload);
  }

  updateConfigNotifications(payload: NotificationConfigResponse<NotificationConfigItem>): Observable<unknown> {
    return this.http.post(`${SCHEDULER_API_PATH}/notify/configuration`, payload);
  }

  updateSettingNotifications(payload: NotificationSettingResponse): Observable<unknown> {
    return this.http.post(`${SCHEDULER_API_PATH}/notify/setting`, payload);
  }

  upsertNotification(payload: NotificationItem): Observable<unknown> {
    return payload.notifyId ? this.updateNotification(payload) : this.createNotification(payload);
  }

  deleteNotification(notificationId: string): Observable<unknown> {
    return this.http.delete(`${SCHEDULER_API_PATH}/notification/delete-notify/${notificationId}`);
  }

  getApplications(): Observable<Application[]> {
    return this.http
      .get<BaseResponse<Application[]>>(`${SCHEDULER_API_PATH}/notify/config/get-application-list`)
      .pipe(map((res) => res.data));
  }

  getNotificationEmailVariables(): Observable<EmailVariable[]> {
    return this.http
      .get<BaseResponse<EmailVariable[]>>(`${SCHEDULER_API_PATH}/notify/temp-variables`)
      .pipe(map((res) => res.data));
  }

  doLoadEmailVariables(): void {
    if (!this.get('emailVariables')) {
      this.loadEmailVariables$.next();
    }
  }
  doConfigNotifications(): void {
    if (!this.get('configNotifications')) {
      this.loadConfigNotifications$.next();
    }
  }
  doSettingNotifications(): void {
    if (!this.get('settingNotifications')) {
      this.loadSettingNotifications$.next();
    }
  }
}
