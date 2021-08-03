import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerPaginationTableComponent, ServerPaginationTableComponent } from '@nexthcm/cdk';
import { Pagination } from '@nexthcm/core';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfYesterday, startOfYesterday } from 'date-fns';
import { Columns } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { SearchWorkingHour, WorkingHour } from '../../models/working-hour';
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
export class WorkingHourComponent
  extends AbstractServerPaginationTableComponent<WorkingHour>
  implements ServerPaginationTableComponent<WorkingHour>, OnInit
{
  workingMeStatus = true;
  workingHourData: any;
  workingHourDataOnlyMe: any;
  searchForm!: FormGroup<SearchWorkingHour>;
  searchWorkingHour = new BehaviorSubject<SearchWorkingHour>({ name: '' });
  startOfYesterday = startOfYesterday().valueOf();
  endOfYesterday = endOfYesterday().valueOf();
  myId = this.authService.get('userInfo').userId;
  myWorkingHour = { timeInYesterday: '', timeOutYesterday: '', workingTimeYesterday: '', userOffice: '' };
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);
  readonly searchControl = new FormControl<string>();

  // readonly everyone_columns = [
  //   'cif',
  //   'fullName',
  //   'office',
  //   'date',
  //   'day',
  //   'timeIn',
  //   'timeOut',
  //   'totalWorkingTime',
  //   'workingDay',
  //   'action',
  // ];

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
        { key: 'day', title: result.day },
        { key: 'timeIn', title: result.timeIn },
        { key: 'timeOut', title: result.timeOut },
        { key: 'totalWorkingTime', title: result.totalWorkingTime },
        { key: 'workingDay', title: result.workingDay },
        { key: 'actions', title: result.functions },
      ])
    );

  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', '0').set('size', 10).set('userId', this.authService.get('userInfo', 'userId'))
  );
  readonly request$ = this.queryParams$.pipe(
    switchMap((params) => this.workingHourService.getWorkingHourOnlyMe(params)),
    map((res) => res.data)
  );

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workingHourService: WorkingHourService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService,
    private authService: AuthService,
    private state: RxState<Pagination<WorkingHour>>,
    private translocoService: TranslocoService
  ) {
    super();
    state.connect(this.request$);
  }

  ngOnInit(): void {
    this.getWorkingHourTime();
    this.searchForm = this.formBuilder.group<SearchWorkingHour>({
      name: '',
    });
  }

  workingStatus(type: string): void {
    if (type === 'me') {
      this.workingMeStatus = true;
    }
    if (type === 'all') {
      this.workingMeStatus = false;
      combineLatest([this.page$, this.perPageSubject, this.searchWorkingHour])
        .pipe(
          debounceTime(0),
          switchMap(([page, perpage, search]) => {
            return this.workingHourService.getWorkingHour(page - 1, perpage, search);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((item) => {
          this.workingHourData = item.data.items;
          this.totalLength = item.data.totalElements;
          this.cdr.detectChanges();
        });
    }
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

  getWorkingHourTime() {
    this.workingHourService
      .getWorkingHourByDate(this.myId, this.startOfYesterday, this.endOfYesterday)
      .subscribe((item) => {
        if (item.data?.items[0]?.inTimeToFullTime) {
          this.myWorkingHour.timeInYesterday = item.data.items[0].inTimeToFullTime;
        }
        if (item.data?.items[0]?.outTimeToFulltime) {
          this.myWorkingHour.timeOutYesterday = item.data.items[0].outTimeToFulltime;
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
}
