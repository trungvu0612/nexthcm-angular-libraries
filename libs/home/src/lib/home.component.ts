import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService } from '@nexthcm/cdk';
import { CheckInPayload, CheckOutPayload, WorkingHours, WorkingHoursService } from '@nexthcm/my-time';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { differenceInSeconds, endOfToday, startOfToday, startOfYesterday } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class HomeComponent implements OnInit {
  readonly monthWorkingTime$ = this.workingHoursService.getWorkingTimeCurrentMonth();
  readonly shouldCheckedIn$ = new BehaviorSubject<boolean | null>(null);

  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('userId', this.authService.get('userInfo', 'userId'))
      .set('fromDate', startOfYesterday().getTime())
      .set('toDate', endOfToday().getTime())
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
    private readonly workingHoursService: WorkingHoursService,
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly state: RxState<Record<string, unknown>>
  ) {}

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

  get username(): string | undefined {
    return this.authService.get('userInfo', 'preferred_username');
  }

  ngOnInit(): void {
    this.workingHoursService.getTimekeepingLog().pipe(takeUntil(this.destroy$)).subscribe();
  }

  checkIn(): Observable<unknown> {
    const checkInPayload: CheckInPayload = {
      trackingDate: new Date().getTime(),
      inTime: differenceInSeconds(new Date(), startOfToday()),
      checkinFrom: 'web-app',
      lastAction: 'checked-in',
    };
    return this.workingHoursService
      .checkIn(checkInPayload)
      .pipe(tap(this.promptService.handleResponse('checkInSuccessfully', () => this.shouldCheckedIn$.next(true))));
  }

  checkOut(): Observable<unknown> {
    const checkOutPayload: CheckOutPayload = {
      trackingDate: new Date().getTime(),
      outTime: differenceInSeconds(new Date(), startOfToday()),
      checkoutFrom: 'web-app',
      lastAction: 'checked-out',
    };
    return this.workingHoursService
      .checkOut(checkOutPayload)
      .pipe(tap(this.promptService.handleResponse('checkOutSuccessfully')));
  }
}
