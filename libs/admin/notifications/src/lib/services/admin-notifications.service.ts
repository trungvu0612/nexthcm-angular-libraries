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
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Application } from '../models/application';
import { NotificationItem } from '../models/notification-item';

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationsService {
  constructor(private readonly http: HttpClient) {}

  getNotifications(params: HttpParams): Observable<Pagination<NotificationItem>> {
    return this.http.get<PagingResponse<NotificationItem>>(`${SCHEDULER_API_PATH}/notification/get`, { params }).pipe(
      map((res) => res.data),
      catchError(() => of(DEFAULT_PAGINATION_DATA))
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
}
