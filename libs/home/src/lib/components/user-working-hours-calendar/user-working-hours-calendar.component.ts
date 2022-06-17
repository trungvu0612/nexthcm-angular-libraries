import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, CommonService, NUMBER_FORMAT } from '@nexthcm/cdk';
import { MyTimeService, WorkingHours } from '@nexthcm/my-time';
import { TranslocoService } from '@ngneat/transloco';
import { isPresent, TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { CalendarEvent, DateAdapter } from 'angular-calendar';
import { endOfMonth, getMonth, getYear, setMonth, setYear, startOfMonth } from 'date-fns';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-user-working-hours-calendar',
  templateUrl: './user-working-hours-calendar.component.html',
  styleUrls: ['./user-working-hours-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TUI_NUMBER_FORMAT, useValue: NUMBER_FORMAT }],
})
export class UserWorkingHoursCalendarComponent implements OnInit {
  viewMonth = new Date();
  filterForm = this.formBuilder.group({
    year: [getYear(this.viewMonth), [Validators.required]],
    month: [getMonth(this.viewMonth), [Validators.required]],
  });
  params = new HttpParams().set('size', 31).set('userId', this.authService.get('userInfo', 'userId'));
  readonly monthList$ = this.commonService.localeMonths$;
  readonly locale$ = this.translocoService.langChanges$;
  readonly fetch$ = new BehaviorSubject<void>(undefined);
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.myTimeService.getWorkingHoursOfOnlyMe(this.params).pipe(
        map((res) => res.items),
        startWith(null)
      )
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );
  readonly events$: Observable<CalendarEvent<{ workingHours: WorkingHours }>[]> = this.request$.pipe(
    filter(isPresent),
    map((workingHoursItems: WorkingHours[]) =>
      workingHoursItems.map(
        (workingHours) =>
          ({
            title: workingHours.leaveType,
            start: new Date(workingHours.trackingDate),
            allDay: true,
            meta: { workingHours },
          } as CalendarEvent<{ workingHours: WorkingHours }>)
      )
    )
  );

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly commonService: CommonService,
    private readonly authService: AuthService,
    private readonly myTimeService: MyTimeService,
    private readonly dateAdapter: DateAdapter,
    private readonly translocoService: TranslocoService
  ) {}

  workingHours = (data: WorkingHours) => data;

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onFilters(): void {
    const { year, month } = this.filterForm.value;

    this.viewMonth = setYear(setMonth(this.viewMonth, month), year);
    this.params = this.params.set('year', year).set('month', month);
    this.fetchData();
  }

  onPrevMonthClick(): void {
    this.viewMonth = this.dateAdapter.subMonths(this.viewMonth, 1);
    this.params = this.params.set('month', getMonth(this.viewMonth));
    this.fetchData();
  }

  onNextMonthClick(): void {
    this.viewMonth = this.dateAdapter.addMonths(this.viewMonth, 1);
    this.params = this.params.set('month', getMonth(this.viewMonth));
    this.fetchData();
  }

  private fetchData(): void {
    this.params = this.params
      .set('fromDate', startOfMonth(this.viewMonth).getTime())
      .set('toDate', endOfMonth(this.viewMonth).getTime());
    this.fetch$.next();
  }
}
