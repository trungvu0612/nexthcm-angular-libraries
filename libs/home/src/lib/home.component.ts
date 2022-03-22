import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService, UserProfileService } from '@nexthcm/cdk';
import { MyTimeService, WorkingHours } from '@nexthcm/my-time';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { TranslocoService } from '@ngneat/transloco';
import { isPresent, tuiPure } from '@taiga-ui/cdk';
import { endOfToday, startOfYesterday } from 'date-fns';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('userId', this.authService.get('userInfo', 'userId'))
      .set('fromDate', startOfYesterday().getTime())
      .set('toDate', endOfToday().getTime())
  );
  readonly fullName$ = this.userProfileService.select('general', 'fullName');
  readonly monthWorkingTime$ = this.workingHoursService.getWorkingTimeCurrentMonth();
  readonly shouldCheckedOut$ = new BehaviorSubject<boolean | null>(false);
  readonly checkedId$ = this.workingHoursService.getTimekeepingLog().pipe(
    tap((item) => this.shouldCheckedOut$.next(item.id ? !!item.inTime : null)),
    map((item) => item.id),
    filter(isPresent)
  );
  readonly checkInOut$ = new Subject<void>();
  private readonly checkInOutHandler$ = this.checkInOut$.pipe(
    switchMap(() =>
      this.geolocation$.pipe(
        take(1),
        switchMap(({ coords: { latitude, longitude } }) =>
          this.checkedId$.pipe(
            switchMap(() =>
              this.promptService.open({
                icon: 'question',
                html: this.translocoService.translate(
                  this.shouldCheckedOut$.value ? 'checkOutConfirm' : 'checkInConfirm'
                ),
                showCancelButton: true,
              })
            ),
            switchMap(({ isConfirmed }) =>
              isConfirmed
                ? this.workingHoursService.checkInOut({ typeCheckInOut: 'web-app', latitude, longitude }).pipe(
                    tap(
                      this.promptService.handleResponse(
                        this.shouldCheckedOut$.value ? 'checkOutSuccessfully' : 'checkInSuccessfully',
                        () => {
                          this.shouldCheckedOut$.next(true);
                          this.queryParams$.next(this.queryParams$.value);
                        }
                      )
                    )
                  )
                : of(true)
            ),
            catchError(() => of(true))
          )
        ),
        catchError((err: GeolocationPositionError) => this.showGeolocationError(err)),
        startWith(null)
      )
    )
  );
  readonly checkInOutLoading$ = this.checkInOutHandler$.pipe(
    startWith('init'),
    switchMap((value) => (value === 'init' ? this.checkedId$.pipe(startWith(null)) : of(value))),
    map((value) => !value)
  );
  private readonly myWorkingDaysRequest$ = this.queryParams$.pipe(
    switchMap((params) =>
      this.workingHoursService.getWorkingHoursOfOnlyMe(params).pipe(
        map((res) => res.items),
        startWith(null)
      )
    ),
    share()
  );
  readonly loading$ = this.myWorkingDaysRequest$.pipe(map((value) => !value));
  readonly myWorkingDays$: Observable<WorkingHours[]> = this.myWorkingDaysRequest$.pipe(filter(isPresent));

  constructor(
    private readonly workingHoursService: MyTimeService,
    private readonly authService: AuthService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly userProfileService: UserProfileService,
    private readonly geolocation$: GeolocationService
  ) {}

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

  private showGeolocationError(error: GeolocationPositionError): Observable<unknown> {
    let message: string;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'GEOLOCATION.ERROR.PERMISSION_DENIED';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'GEOLOCATION.ERROR.POSITION_UNAVAILABLE';
        break;
      case error.TIMEOUT:
        message = 'GEOLOCATION.ERROR.TIMEOUT';
        break;
      default:
        message = 'errorOccurred';
        break;
    }

    return from(
      this.promptService.open({
        icon: 'error',
        html: `<b>${this.translocoService.translate(message)}</b>`,
      })
    );
  }
}
