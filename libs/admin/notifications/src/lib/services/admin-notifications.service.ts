import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DEFAULT_PAGINATION_DATA, Pagination } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';

import { NotificationItem } from '../models/notification-item';

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationsService {
  constructor(private readonly http: HttpClient) {}

  getNotifications(params: HttpParams): Observable<Pagination<NotificationItem>> {
    return of(DEFAULT_PAGINATION_DATA);
  }

  createNotification(payload: NotificationItem): Observable<unknown> {
    return of(payload);
  }

  updateNotification(payload: NotificationItem): Observable<unknown> {
    return of(payload);
  }

  upsertNotification(payload: NotificationItem): Observable<unknown> {
    return payload.id ? this.updateNotification(payload) : this.createNotification(payload);
  }
}
