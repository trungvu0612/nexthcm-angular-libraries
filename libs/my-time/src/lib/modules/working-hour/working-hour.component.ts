import { getLocaleMonthNames } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerPaginationTableComponent, BaseOption, Pagination } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiContextWithImplicit, TuiDestroyService, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  add,
  endOfMonth,
  endOfYear,
  endOfYesterday,
  getMonth,
  getYear,
  setMonth,
  setYear,
  startOfMonth,
  startOfYear,
  startOfYesterday,
  subMilliseconds,
} from 'date-fns';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SearchWorkingHour, WeekInfo, WorkingHour } from '../../models';
import { WorkingHourService } from '../../services/working-hour.service';
import { RequestOtComponent } from './request-ot/request-ot.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHourDetailComponent } from './working-hour-detail/working-hour-detail.component';
import { WorkingOutsiteComponent } from './working-outsite/working-outsite.component';

@Component({
  selector: 'hcm-working-hour',
  templateUrl: './working-hour.component.html',
  styleUrls: ['./working-hour.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourComponent extends AbstractServerPaginationTableComponent<WorkingHour> implements OnInit {
  @ViewChild('table') table!: BaseComponent;
  searchForm = this.formBuilder.group<SearchWorkingHour>({
    month: getMonth(Date.now()),
    year: getYear(Date.now()),
    search: null,
    week: null,
  } as SearchWorkingHour);
  startOfYesterday = startOfYesterday().valueOf();
  endOfYesterday = endOfYesterday().valueOf();
  myId = this.authService.get('userInfo').userId;
  myWorkingHour = { timeInYesterday: 0, timeOutYesterday: 0, workingTimeYesterday: 0, userOffice: '' };
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  search$ = new BehaviorSubject<string>('');
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_WORKING_HOUR_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'office', title: result.office },
        { key: 'nameHoliday', title: result.date },
        { key: 'day', title: result.day },
        { key: 'timeIn', title: result.timeIn },
        { key: 'timeOut', title: result.timeOut },
        { key: 'totalWorkingTime', title: result.totalWorkingTime },
        { key: 'workingDay', title: result.workingDay },
        { key: 'ot', title: result.ot },
        { key: 'onsiteDay', title: result.onsiteDay },
        { key: 'leave', title: result.leave },
        { key: 'actions', title: result.functions },
      ])
    );

  columnsEveryone$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_WORKING_HOUR_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'office', title: result.office },
        { key: 'date', title: result.date },
        { key: 'timeIn', title: result.timeIn },
        { key: 'timeOut', title: result.timeOut },
        { key: 'totalWorkingTime', title: result.totalWorkingTime },
        { key: 'workingDay', title: result.workingDay },
        { key: 'actions', title: result.functions },
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    this.generateFirstQueryParam()
  );
  readonly onlyMe$ = new BehaviorSubject(false);
  readonly monthList$: Observable<BaseOption<number>[]> = this.translocoService.langChanges$.pipe(
    map((lang) => getLocaleMonthNames(lang, 1, 2).map((month, index) => ({ label: month, value: index })))
  );
  readonly weekList$: Observable<BaseOption<WeekInfo>[]> = combineLatest([this.searchForm.get('month').valueChanges.pipe(startWith(this.month)), this.translocoService.langChanges$]).pipe(
    map((month,_lang) => {
      const NOW = Date.now();
      const startOfMonthDate = startOfMonth(setMonth(setYear(NOW, this.year), this.month));
      const endOfMonthDate = endOfMonth(setMonth(setYear(NOW, this.year), this.month));
      let weekArray = new Array<WeekInfo>();
      let currentWeekDate = startOfMonthDate;
      let index = 1;
      while(currentWeekDate < endOfMonthDate) {
        const weekStart = currentWeekDate;
        const nextStartWeek = add(currentWeekDate, {weeks: 1});
        let weekEndMilisSub = subMilliseconds(nextStartWeek, 1);
        if (weekEndMilisSub > endOfMonthDate) {
          weekEndMilisSub = endOfMonthDate;
        }
        const weekObject: WeekInfo = {week: index, weekStart: weekStart.valueOf(),weekEnd: weekEndMilisSub.valueOf()};
        weekArray.push(weekObject);
        currentWeekDate = nextStartWeek;
        index++;
      }
      return weekArray.map((weekInfo) => ({label: `${this.translocoService.translate('week')} ${weekInfo.week}`, value: weekInfo} as BaseOption<WeekInfo>));
    }));
  private readonly request$ = combineLatest([this.queryParams$, this.onlyMe$]).pipe(
    switchMap(([params, onlyMe]) => {
      if (onlyMe) {
        params = params.set('userId', this.myId);
        return this.workingHourService.getWorkingHourOnlyMe(params);
      }

      params = params.delete('userId');
      return this.workingHourService.getWorkingHourEveryone(params);
    }),
    map((res) => res.data)
  );


  constructor(
    public state: RxState<Pagination<WorkingHour>>,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workingHourService: WorkingHourService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService,
    private authService: AuthService,
    private translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$);
  }

  get year() {
    return this.searchForm.get('year').value;
  }

  get month() {
    return this.searchForm.get('month').value;
  }

  get week(): WeekInfo {
    return this.searchForm.get('week').value as WeekInfo;
  }

  requestOT(): void {
    this.dialogService
      .open(new PolymorpheusComponent(RequestOtComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  workingOutsite(): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingOutsiteComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  workingHourDetail(id: any): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingHourDetailComponent, this.injector), {
        size: 'm',
        closeable: false,
        data: id,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  requestUpdateTime(id: any): void {
    this.dialogService
      .open(new PolymorpheusComponent(RequestUpdateTimeComponent, this.injector), {
        size: 'm',
        closeable: false,
        data: id,
      })
      .subscribe((map) => {
        this.cdr.detectChanges();
      });
  }

  onSearch(): void {}

  get search() {
    return this.searchForm.get('search').value;
  }

  ngOnInit(): void {
    this.getWorkingHourTime();
    this.onlyMe$.pipe(tap((onlyMe) => {

    }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  workingStatus(type: string): void {
    if (type === 'me') {
      this.onlyMe$.next(true);
    }
    if (type === 'all') {
      this.onlyMe$.next(false);
    }
  }

  getWorkingHourTime() {
    this.workingHourService
      .getWorkingHourByDate(this.myId, this.startOfYesterday, this.endOfYesterday)
      .subscribe((item) => {
        if (item.data?.items[0]?.inTime) {
          this.myWorkingHour.timeInYesterday = item.data.items[0].inTime;
        }
        if (item.data?.items[0]?.outTime) {
          this.myWorkingHour.timeOutYesterday = item.data.items[0].outTime;
        }
        if (item.data?.items[0]?.totalWorkingTime) {
          this.myWorkingHour.workingTimeYesterday = item.data.items[0].totalWorkingTime;
        }
        if (item.data?.items[0]?.userInfo?.office?.name) {
          this.myWorkingHour.userOffice = item.data?.items[0].userInfo.office.name;
        }
        this.cdr.detectChanges();
      });
  }

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  @tuiPure
  weekStringify(items: ReadonlyArray<BaseOption<WeekInfo>>): TuiStringHandler<TuiContextWithImplicit<WeekInfo>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<WeekInfo>) => map.get($implicit) || '';
  }

  onFilterByYear(): void {
    this.queryParams$.next(this.filterByYearMonth());
  }

  onFilterByMonth(value: number | null): void {
    this.queryParams$.next(this.filterByYearMonth());
  }

  onFilterByWeek() {
    this.queryParams$.next(this.filterByWeek());
  }

  onFilter(key: string, value: string | number | null): HttpParams {
    let httpParams = this.queryParams$.value;
    if (value) {
      this.queryParams$.next(this.queryParams$.value.set(key, value));
    } else {
      this.queryParams$.next(this.queryParams$.value.delete(key));
    }
    return httpParams;
  }

  private generateFirstQueryParam(): HttpParams {
    const NOW = Date.now();
    const fromDate = startOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
    const toDate = endOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
    return new HttpParams().set('page', '0').set('size', 10).set('userId', this.authService.get('userInfo', 'userId')).set('fromDateForGroupBy', fromDate).set('toDateForGroupBy', toDate);
  }

  private filterByYearMonth(): HttpParams {
    let httpParams = this.queryParams$.value;
    if (this.year !== null) {
      let fromDate: number;
      let toDate: number;
      const NOW = new Date();
      if (this.month !== null) {
        fromDate = startOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
        toDate = endOfMonth(setMonth(setYear(NOW, this.year), this.month)).valueOf();
      } else {
        fromDate = startOfYear(setYear(NOW, this.year)).valueOf();
        toDate = endOfYear(setYear(NOW, this.year)).valueOf();
      }
      httpParams = httpParams.set('fromDateForGroupBy', fromDate).set('toDateForGroupBy', toDate);
    } else {
      httpParams = httpParams.delete('fromDateForGroupBy').delete('toDateForGroupBy');
    }
    return httpParams;
  }

  private filterByWeek(): HttpParams {
    let httpParams = this.queryParams$.value;
    if (!this.week) {
      httpParams = this.filterByYearMonth();
      return httpParams;
    }
    const fromDate = this.week.weekStart;
    const toDate = this.week.weekEnd;
    httpParams = httpParams.set('fromDateForGroupBy', fromDate).set('toDateForGroupBy', toDate);
    return httpParams;
  }
}
