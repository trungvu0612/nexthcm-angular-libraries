import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService, UserProfileService } from '@nexthcm/cdk';
import { MyTimeService } from '@nexthcm/my-time';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { TranslocoService } from '@ngneat/transloco';
import { isPresent, tuiPure } from '@taiga-ui/cdk';
import { endOfToday, startOfYesterday } from 'date-fns';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly fullName$ = this.userProfileService.select('general', 'fullName');
  readonly monthWorkingTime$ = this.myTimeService.getWorkingTimeCurrentMonth().pipe(startWith(null));

  readonly fetch$ = new Subject<void>();
  readonly checkInOut$ = new Subject<void>();
  readonly shouldCheckedOut$ = new BehaviorSubject<boolean | null>(false);

  readonly checkedId$ = this.myTimeService.getTimekeepingLog().pipe(
    tap((item) => this.shouldCheckedOut$.next(item.id ? !!item.inTime : null)),
    map((item) => item.id),
    filter(isPresent)
  );
  readonly checkInOutLoading$ = this.checkInOut$.pipe(
    switchMap(() => this.checkedId$),
    switchMap(() =>
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(this.shouldCheckedOut$.value ? 'checkOutConfirm' : 'checkInConfirm'),
        showCancelButton: true,
      })
    ),
    switchMap(({ isConfirmed }) => (isConfirmed ? this.checkInOut() : of(true))),
    startWith('init'),
    switchMap((value) => (value === 'init' ? this.checkedId$.pipe(startWith(null)) : of(value))),
    map((value) => !value)
  );

  private readonly params = new HttpParams()
    .set('userId', this.authService.get('userInfo', 'userId'))
    .set('fromDate', startOfYesterday().getTime())
    .set('toDate', endOfToday().getTime());
  readonly myWorkingDays$ = this.fetch$.pipe(
    startWith(null),
    switchMap(() =>
      this.myTimeService.getWorkingHoursOfOnlyMe(this.params).pipe(
        map((res) => res.items),
        startWith(null)
      )
    )
  );
  private httpBackend!: HttpClient;

  constructor(
    private readonly myTimeService: MyTimeService,
    private readonly authService: AuthService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly userProfileService: UserProfileService,
    private readonly geolocation$: GeolocationService,
    httpBackend: HttpBackend
  ) {
    this.httpBackend = new HttpClient(httpBackend);
  }

  @tuiPure
  get greeting(): string {
    const time = new Date().getHours();

    return time < 12
      ? 'goodMorning'
      : time >= 12 && time < 17
      ? 'goodAfternoon'
      : time >= 17 && time < 21
      ? 'goodEvening'
      : 'goodNight';
  }

  private showGeolocationError(error: GeolocationPositionError): void {
    let message: string;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'GEOLOCATION.PERMISSION_DENIED';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'GEOLOCATION.POSITION_UNAVAILABLE';
        break;
      case error.TIMEOUT:
        message = 'GEOLOCATION.TIMEOUT';
        break;
      default:
        message = 'errorOccurred';
        break;
    }

    this.promptService.open({
      icon: 'error',
      html: `<b>${this.translocoService.translate(message)}</b>`,
    });
  }

  private checkInOut(): Observable<unknown> {
    return this.geolocation$.pipe(
      take(1),
      tap({ error: (err: GeolocationPositionError) => this.showGeolocationError(err) }),
      switchMap(({ coords: { latitude, longitude } }) =>
        this.httpBackend
          .get<{ display_name: string }>('https://nominatim.openstreetmap.org/reverse', {
            params: { lat: latitude, lon: longitude, format: 'json' },
          })
          .pipe(
            catchError(() => of({ display_name: '' })),
            switchMap(({ display_name }) =>
              this.myTimeService.checkInOut({ typeCheckInOut: 'web-app', latitude, longitude, address: display_name })
            ),
            tap(
              this.promptService.handleResponse(
                this.shouldCheckedOut$.value ? 'checkOutSuccessfully' : 'checkInSuccessfully'
              )
            ),
            tap(() => {
              this.shouldCheckedOut$.next(true);
              this.fetch$.next();
            }),
            startWith(null)
          )
      ),
      catchError(() => of(true))
    );
  }
}
