import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService, UserProfileService } from '@nexthcm/cdk';
import { MyTimeService, WorkingHours } from '@nexthcm/my-time';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, tuiPure } from '@taiga-ui/cdk';
import { endOfToday, startOfYesterday } from 'date-fns';
import { CRS } from 'leaflet';
import { geocoder } from 'leaflet-control-geocoder';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, take, tap } from 'rxjs/operators';

interface HomeState {
  checkingId: string;
}

@Component({
  selector: 'hcm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
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
  readonly checkInOutRequest$ = new Subject<GeolocationCoordinates>();
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
        tap((geolocationPosition: GeolocationPosition) => this.checkInOutRequest$.next(geolocationPosition.coords)),
        catchError((err: GeolocationPositionError) => this.showGeolocationError(err)),
        startWith(null)
      )
    )
  );
  readonly checkInOutLoading$ = this.checkInOutHandler$.pipe(map((value) => !value));
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
  private readonly geoCoder = geocoder();

  constructor(
    private readonly workingHoursService: MyTimeService,
    private readonly authService: AuthService,
    private readonly promptService: PromptService,
    private readonly state: RxState<HomeState>,
    private readonly translocoService: TranslocoService,
    private readonly userProfileService: UserProfileService,
    private readonly geolocation$: GeolocationService
  ) {
    this.state.connect('checkingId', this.checkedId$);
    this.state.hold(
      this.checkInOutRequest$.pipe(
        switchMap((coords) =>
          this.checkedId$.pipe(
            switchMap(() =>
              this.shouldCheckedOut$.value ? this.checkInOut(coords, true) : this.checkInOut(coords, false)
            )
          )
        ),
        tap(() => this.queryParams$.next(this.queryParams$.value))
      )
    );
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

  private checkInOut({ latitude, longitude }: GeolocationCoordinates, isCheckOut: boolean): Observable<unknown> {
    const address$ = new Observable<string | null>((observer) => {
      if (this.geoCoder.options.geocoder?.reverse) {
        this.geoCoder.options.geocoder.reverse({ lat: latitude, lng: longitude }, CRS.EPSG3857.scale(20), (result) => {
          if (result.length) {
            observer.next(result[0].name);
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      } else {
        observer.next(null);
        observer.complete();
      }
    });

    return address$.pipe(
      filter(isPresent),
      switchMap((address) =>
        from(
          this.promptService.open({
            icon: 'question',
            html: this.translocoService.translate(isCheckOut ? 'checkOutConfirm' : 'checkInConfirm'),
            showCancelButton: true,
          })
        ).pipe(
          filter((result) => result.isConfirmed),
          switchMap(() =>
            this.workingHoursService.checkInOut({ typeCheckInOut: 'web-app', latitude, longitude, address })
          ),
          tap(
            this.promptService.handleResponse(isCheckOut ? 'checkOutSuccessfully' : 'checkInSuccessfully', () =>
              this.shouldCheckedOut$.next(true)
            )
          )
        )
      )
    );
  }
}
