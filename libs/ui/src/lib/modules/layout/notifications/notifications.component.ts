import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Notifications, NotificationsService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { setTimeout } from '@rx-angular/cdk/zone-less/browser';
import { RxState } from '@rx-angular/state';
import { TuiDialogService, TuiScrollbarComponent } from '@taiga-ui/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as enStrings } from 'ngx-timeago/language-strings/en';
import { strings as viStrings } from 'ngx-timeago/language-strings/vi';
import { IL10nsStrings } from 'ngx-timeago/timeago.intl';
import { startWith, Subject, switchMap, tap } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

const TIMEAGO_STRINGS: Record<string, IL10nsStrings> = { en: enStrings, vi: viStrings };

@Component({
  selector: 'hcm-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class NotificationsComponent {
  @ViewChild(TuiScrollbarComponent) tuiScrollbar!: TuiScrollbarComponent;

  open = false;
  activeItemIndex = 0;
  isLoadMore = false;
  readonly unreadControl = this.fb.control(false);
  readonly notifications$ = this.state.select();
  readonly loading$ = this.notificationsService.loading$;

  dialog = false;
  readonly options = [
    { value: 'MINUTES_15', label: 'for15Minutes' },
    { value: 'MINUTES_30', label: 'for30Minutes' },
    { value: 'HOURS_1', label: 'for1Hour' },
    { value: 'HOURS_4', label: 'for4Hours' },
  ];
  readonly bellControl = this.fb.control(this.options[0].value);
  readonly form = this.fb.group({ bell: this.bellControl });
  readonly mute$ = this.notificationsService.mute$.pipe(distinctUntilChanged());

  readonly markAllAsRead$ = new Subject<void>();
  readonly setting$ = new Subject<void>();

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly permissionsService: NgxPermissionsService,
    private readonly router: Router,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly state: RxState<Notifications>,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    timeagoIntl: TimeagoIntl
  ) {
    state.hold(translocoService.langChanges$, (lang) => {
      timeagoIntl.strings = TIMEAGO_STRINGS[lang];
      timeagoIntl.changes.next();
    });
    state.hold(this.unreadControl.valueChanges, () => this.notificationsService.sendMessage('status'));
    state.hold(this.markAllAsRead$.pipe(switchMap(() => this.notificationsService.markAllAsRead())));
    state.connect(
      this.notificationsService.notifications$.pipe(
        startWith(null),
        tap((value) => {
          value === null && this.notificationsService.sendMessage('init');
        }),
        filter((value): value is Notifications => value !== null),
        tap(() => (this.isLoadMore = false))
      )
    );
  }

  async navigateToRequests(): Promise<void> {
    this.open = false;
    const url = (await this.permissionsService.hasPermission([
      'VIEW_WORKING_HOUR_EVERYONE',
      'VIEW_SUBORDINATE_REQUEST',
    ]))
      ? '/my-time/requests'
      : '/my-time/my-leave';
    if (!this.router.url.startsWith(url)) await this.router.navigateByUrl(url);
  }

  onOpenChange(open: boolean) {
    this.open = open;
    if (open) {
      this.notificationsService.sendMessage('init');
      setTimeout(() => {
        const scrollElement = this.tuiScrollbar.browserScrollRef.nativeElement;
        scrollElement.addEventListener(
          'scroll',
          () => {
            if (
              scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight &&
              !this.isLoadMore &&
              this.state.get().data.data.hasNext
            ) {
              this.isLoadMore = true;
              this.notificationsService.sendMessage('more');
            }
          },
          { passive: true }
        );
      });
    }
  }

  onTypeChange(index: number): void {
    this.activeItemIndex = index;
    this.notificationsService.sendMessage('type');
  }

  turnOffNotifications(): void {
    this.dialog = false;
    this.notificationsService.turnOffNotifications(this.form.value.bell);
  }

  turnOnNotifications(): void {
    this.notificationsService.turnOnNotifications();
  }
}
