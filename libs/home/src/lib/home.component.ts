import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { ProfileGeneralQuery, PromptService } from '@nexthcm/cdk';
import { CheckInOutPayload, MyTimeService, WorkingHours } from '@nexthcm/my-time';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { endOfToday, startOfYesterday } from 'date-fns';
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
export class HomeComponent {
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('userId', this.authService.get('userInfo', 'userId'))
      .set('fromDate', startOfYesterday().getTime())
      .set('toDate', endOfToday().getTime())
  );
  readonly fullName$ = this.profileGeneralQuery.select('fullName');
  readonly monthWorkingTime$ = this.workingHoursService.getWorkingTimeCurrentMonth();
  readonly shouldCheckedOut$ = new BehaviorSubject<boolean | null>(false);
  readonly checkInOut$ = new Subject<void>();
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
    private readonly workingHoursService: MyTimeService,
    private readonly authService: AuthService,
    private readonly promptService: PromptService,
    private readonly state: RxState<HomeState>,
    private readonly translocoService: TranslocoService,
    private readonly profileGeneralQuery: ProfileGeneralQuery
  ) {
    this.state.connect('checkingId', this.checkedId$);
    this.state.hold(
      this.checkInOut$.pipe(
        switchMap(() => this.checkedId$),
        switchMap(() => (this.shouldCheckedOut$.value ? this.checkInOut(true) : this.checkInOut(false))),
        tap(() => this.queryParams$.next(this.queryParams$.value))
      )
    );
  }

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

  private checkInOut(isCheckOut: boolean): Observable<unknown> {
    const payload: CheckInOutPayload = { typeCheckInOut: 'web-app' };

    return from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(isCheckOut ? 'checkOutConfirm' : 'checkInConfirm'),
        showCancelButton: true,
      })
    ).pipe(
      filter((result) => result.isConfirmed),
      switchMap(() => this.workingHoursService.checkInOut(payload)),
      tap(
        this.promptService.handleResponse(isCheckOut ? 'checkOutSuccessfully' : 'checkInSuccessfully', () =>
          this.shouldCheckedOut$.next(true)
        )
      )
    );
  }
}
