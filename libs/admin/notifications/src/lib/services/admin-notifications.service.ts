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
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Application } from '../models/application';
import { NotificationConfigItem, NotificationConfigResponse } from '../models/notification-config';
import { NotificationItem } from '../models/notification-item';
import { NotificationSettingResponse } from '../models/notification-setting';

interface AdminNotificationsState {
  emailVariables: EmailVariable[];
  configNotifications: NotificationConfigResponse<NotificationConfigItem>[];
  settingNotifications: NotificationSettingResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationsService extends RxState<AdminNotificationsState> {
  readonly emailVariables$ = this.select('emailVariables');
  readonly configNotifications$ = this.select('configNotifications');
  private readonly loadEmailVariables$ = new Subject<void>();
  private readonly loadConfigNotifications$ = new Subject<void>();
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
  }

  getNotifications(params: HttpParams): Observable<Pagination<NotificationItem>> {
    return this.http.get<PagingResponse<NotificationItem>>(`${SCHEDULER_API_PATH}/notification/get`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of(DEFAULT_PAGINATION_DATA))
    );
  }

  getConfigNotifications(): Observable<NotificationConfigResponse<NotificationConfigItem>[]> {
    return this.http.get<NotificationConfigResponse<NotificationConfigItem>[]>(
      `${SCHEDULER_API_PATH}/notify/list-config`
    );
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

  updateConfigNotifications(payload: NotificationConfigResponse<NotificationConfigItem>[]): Observable<unknown> {
    return this.http.post(`${SCHEDULER_API_PATH}/notify/configuration`, payload);
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
}
