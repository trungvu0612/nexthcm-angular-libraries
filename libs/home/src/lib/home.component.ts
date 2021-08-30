import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService } from '@nexthcm/cdk';
import { CheckInPayload, CheckOutPayload, WorkingHours, WorkingHoursService } from '@nexthcm/my-time';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { differenceInSeconds, endOfToday, startOfToday, startOfYesterday } from 'date-fns';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';

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
export class HomeComponent implements OnInit {
  greeting = '';
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('userId', this.authService.get('userInfo', 'userId'))
      .set('fromDate', startOfYesterday().getTime())
      .set('toDate', endOfToday().getTime())
  );
  readonly username = this.authService.get('userInfo', 'preferred_username');
  readonly monthWorkingTime$ = this.workingHoursService.getWorkingTimeCurrentMonth();
  readonly shouldCheckedOut$ = new BehaviorSubject<boolean | null>(false);
  readonly checkInOut$ = new Subject();
  readonly checkedId$ = this.workingHoursService.getTimekeepingLog().pipe(
    tap((item) => this.shouldCheckedOut$.next(item.id ? !!item.inTime : null)),
    map((item) => item.id),
    filter(isPresent)
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
    private readonly promptService: PromptService,
    private readonly state: RxState<HomeState>,
    private readonly translocoService: TranslocoService
  ) {
    this.state.connect('checkingId', this.checkedId$);
    this.state.hold(
      this.checkInOut$.pipe(
        switchMap(() => this.checkedId$),
        switchMap((checkedId) => (this.shouldCheckedOut$.value ? this.checkOut(checkedId) : this.checkIn(checkedId))),
        tap(() => this.queryParams$.next(this.queryParams$.value))
      )
    );
  }

  ngOnInit(): void {
    this.getGreeting();
  }

  getGreeting(): void {
    const time = new Date().getHours();
    this.greeting =
      time < 12
        ? 'goodMorning'
        : time >= 12 && time < 17
        ? 'goodAfternoon'
        : time >= 17 && time < 21
        ? 'goodEvening'
        : 'goodNight';
  }

  private checkIn(id: string): Observable<unknown> {
    const checkInPayload: CheckInPayload = {
      trackingDate: new Date().getTime(),
      inTime: differenceInSeconds(new Date(), startOfToday()),
      checkinFrom: 'web-app',
      lastAction: 'checked-in',
    };
    return from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('checkInConfirm'),
        showCancelButton: true,
      })
    ).pipe(
      filter((result) => result.isConfirmed),
      switchMap(() => this.workingHoursService.checkIn(id, checkInPayload)),
      tap(this.promptService.handleResponse('checkInSuccessfully', () => this.shouldCheckedOut$.next(true)))
    );
  }

  private checkOut(id: string): Observable<unknown> {
    const checkOutPayload: CheckOutPayload = {
      trackingDate: new Date().getTime(),
      outTime: differenceInSeconds(new Date(), startOfToday()),
      checkoutFrom: 'web-app',
      lastAction: 'checked-out',
    };
    return from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('checkOutConfirm'),
        showCancelButton: true,
      })
    ).pipe(
      filter((result) => result.isConfirmed),
      switchMap(() => this.workingHoursService.checkOut(id, checkOutPayload)),
      tap(this.promptService.handleResponse('checkOutSuccessfully'))
    );
  }
}
