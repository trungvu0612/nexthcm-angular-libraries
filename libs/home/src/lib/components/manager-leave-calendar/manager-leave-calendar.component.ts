import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseOption, CommonService, NUMBER_FORMAT, Pagination, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { LeaveCalendarEmployee, LeaveTypeShortName, MyTimeService } from '@nexthcm/my-time';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_NUMBER_FORMAT } from '@taiga-ui/core';
import { addMonths, getDaysInMonth, getMonth, getYear, setMonth, setYear, subMonths } from 'date-fns';
import { BehaviorSubject, EMPTY, from, iif, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-manager-leave-calendar',
  templateUrl: './manager-leave-calendar.component.html',
  styleUrls: ['./manager-leave-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, { provide: TUI_NUMBER_FORMAT, useValue: NUMBER_FORMAT }],
})
export class ManagerLeaveCalendarComponent implements OnInit {
  columns: string[] = [];
  dateColumns: string[] = [];
  viewMonth = new Date();
  filterForm = this.fb.group({
    year: [getYear(this.viewMonth), [Validators.required]],
    month: [getMonth(this.viewMonth), [Validators.required]],
    search: '',
  });
  params = new HttpParams().set('size', 10);
  readonly locale$ = this.translocoService.langChanges$;
  readonly fetch$ = new Subject<void>();
  readonly fetchLeaveTypeShortNames$ = new BehaviorSubject<HttpParams>(this.params);
  readonly data$: Observable<LeaveCalendarEmployee[]> = this.state.select('items').pipe(startWith([]));
  readonly total$ = this.state.select('totalElements');
  readonly page$ = this.state.select('page').pipe(map((page) => (page <= 0 ? 0 : page - 1)));
  readonly size$ = this.state.select('size');
  readonly changeRequestStatus$ = new Subject<[string, WorkflowStatus]>();
  readonly changeRequestStatusHandler$ = this.changeRequestStatus$.pipe(
    switchMap(([requestId, status]) =>
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('changeWorkflowStatus', { name: status.name }),
          showCancelButton: true,
        })
      ).pipe(
        switchMap((result) =>
          iif(
            () => result.isConfirmed,
            this.myTimeService.changeLeaveRequestStatus(requestId, status.id).pipe(
              tap(() => this.fetch$.next()),
              catchError((err) =>
                from(
                  this.promptService.open({
                    icon: 'error',
                    html: this.promptService.generateErrorMessage(err),
                  })
                )
              ),
              startWith(null)
            ),
            EMPTY
          )
        )
      )
    )
  );
  readonly monthList$ = this.commonService.localeMonths$;
  readonly leaveTypeShortNames$: Observable<LeaveTypeShortName[]> = this.fetchLeaveTypeShortNames$.pipe(
    switchMap((params) => this.myTimeService.getLeaveTypeShortNames(params))
  );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.myTimeService.getManagerLeaveCalendar(this.params).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly state: RxState<Pagination<LeaveCalendarEmployee>>,
    private readonly commonService: CommonService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly myTimeService: MyTimeService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(this.changeRequestStatusHandler$);
  }

  @tuiPure
  monthStringify(items: ReadonlyArray<BaseOption<number>>): TuiStringHandler<TuiContextWithImplicit<number>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));
    return ({ $implicit }: TuiContextWithImplicit<number>) => map.get($implicit) || '';
  }

  ngOnInit(): void {
    this.onFilters();
  }

  onFilters(): void {
    const { year, month, search } = this.filterForm.value;

    this.viewMonth = setYear(setMonth(this.viewMonth, month), year);
    this.params = this.params.delete('page').set('year', year).set('month', month).set('search', search);
    this.fetchData();
  }

  onSize(size: number): void {
    this.params = this.params.set('size', size);
    this.fetch$.next();
  }

  onPage(page: number): void {
    this.params = this.params.set('page', page);
    this.fetch$.next();
  }

  onPrevMonthClick(): void {
    this.viewMonth = subMonths(this.viewMonth, 1);
    this.params = this.params.delete('page').set('month', getMonth(this.viewMonth));
    this.fetchData();
  }

  onNextMonthClick(): void {
    this.viewMonth = addMonths(this.viewMonth, 1);
    this.params = this.params.delete('page').set('month', getMonth(this.viewMonth));
    this.fetchData();
  }

  private fetchData(): void {
    this.dateColumns = Array.from({ length: getDaysInMonth(this.viewMonth) }, (_, i) => `${i + 1}`);
    this.columns = ['cif', 'fullName'].concat(this.dateColumns);
    this.fetchLeaveTypeShortNames$.next(this.params);
    this.fetch$.next();
  }
}
