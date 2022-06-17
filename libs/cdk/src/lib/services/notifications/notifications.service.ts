import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Notifications, NotificationSettings } from '@nexthcm/cdk';
import { APP_CONFIG, AppConfig } from '@nexthcm/core';
import { RxStomp } from '@stomp/rx-stomp';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends RxStomp {
  sound = 0;
  readonly audio = new Audio('/assets/sounds/notification.mp3');
  readonly mute$ = new BehaviorSubject(false);
  readonly loading$ = new BehaviorSubject(false);
  readonly notifications$ = this.authService.select('userInfo').pipe(
    switchMap(({ userId }) => this.watch(`/user/${userId}/queue/private-notifications`)),
    map(({ body }): Notifications => JSON.parse(body)),
    tap(({ turnOff }) => {
      this.loading$.next(false);
      this.mute$.next(turnOff);
      if (!this.sound && !turnOff) this.audio.play();
      else --this.sound;
    })
  );
  private params: { requestType: '0' | '1'; pageSize: number; statusRead?: boolean } = {
    requestType: '0',
    pageSize: 10,
  };

  constructor(
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {
    super();
    this.configure({
      brokerURL: appConfig.apiUrl.replace('https', 'wss') + '/scheduleapp/websocket',
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 2000,
    });
    this.authService
      .select()
      .pipe(tap(() => this.deactivate()))
      .subscribe(({ access_token }) => {
        if (access_token) {
          this.configure({ connectHeaders: { access_token } });
          this.activate();
        }
      });
  }

  sendMessage(type: 'init' | 'type' | 'status' | 'more') {
    switch (type) {
      case 'init':
        this.params = { ...this.params, pageSize: 10 };
        break;
      case 'type':
        this.params = { ...this.params, requestType: this.params.requestType === '0' ? '1' : '0', pageSize: 10 };
        break;
      case 'status':
        this.params.pageSize = 10;
        if (this.params.statusRead === false) delete this.params.statusRead;
        else this.params.statusRead = false;
        break;
      case 'more':
        this.params = { ...this.params, pageSize: this.params.pageSize + 10 };
        break;
    }
    this.loading$.next(true);
    this.send();
  }

  removeNotification(id: string): Observable<unknown> {
    return this.http
      .delete(this.appConfig.apiUrl + '/scheduleapp/v1.0/notification-mobile', { body: [id] })
      .pipe(tap(() => this.send()));
  }

  markAsRead(id: string): Observable<unknown> {
    return this.http
      .put(this.appConfig.apiUrl + '/scheduleapp/v1.0/notification-mobile', [id])
      .pipe(tap(() => this.send()));
  }

  markAllAsRead(): Observable<unknown> {
    return this.http
      .put(this.appConfig.apiUrl + '/scheduleapp/v1.0/notification-mobile/users', [
        this.authService.get('userInfo').userId,
      ])
      .pipe(tap(() => this.send()));
  }

  turnOffNotifications(value: string): void {
    this.http
      .post('/scheduleapp/v1.0/notification-mobile/turn-off?turnOffTypeDTO=' + value, {})
      .subscribe(() => this.mute$.next(true));
  }

  turnOnNotifications(): void {
    this.http.post('/scheduleapp/v1.0/notification-mobile/turn-on', {}).subscribe(() => this.mute$.next(false));
  }

  getSettings(): Observable<NotificationSettings[]> {
    return this.http.get<NotificationSettings[]>('/scheduleapp/v1.0/notify/list-setting');
  }

  updateSettingNotifications(payload: NotificationSettings[]): Observable<unknown> {
    return this.http.post('/scheduleapp/v1.0/notify/setting', payload);
  }

  private send(): void {
    ++this.sound;
    this.publish({
      destination: '/ws/get-notify-websocket',
      body: JSON.stringify({
        userId: this.authService.get('userInfo').userId,
        ...this.params,
      }),
    });
  }
}
