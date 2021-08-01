import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { SearchWorkingHour, WorkingHour } from '../../models/working-hour';
import { WorkingHourService } from '../../services/working-hour.service';
import { RequestOtComponent } from './request-ot/request-ot.component';
import { RequestUpdateTimeComponent } from './request-update-time/request-update-time.component';
import { WorkingHourDetailComponent } from './working-hour-detail/working-hour-detail.component';
import { WorkingOutsiteComponent } from './working-outsite/working-outsite.component';
import { startOfYesterday, endOfYesterday, differenceInSeconds, startOfToday } from 'date-fns';

@Component({
  selector: 'hcm-working-hour',
  templateUrl: './working-hour.component.html',
  styleUrls: ['./working-hour.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourComponent implements OnInit {
  workingMeStatus = true;
  workingHourData!: WorkingHour[];
  workingHourDataOnlyMe!: WorkingHour[];
  userInfo: any;
  searchForm!: FormGroup<SearchWorkingHour>;
  searchWorkingHour = new BehaviorSubject<SearchWorkingHour>({ name: '' });
  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  toDay = new Date();
  startOfYesterday = startOfYesterday().valueOf();
  endOfYesterday = endOfYesterday().valueOf();
  myId = this.authService.get('userInfo').userId;
  myWorkingHour = { timeInYesterday: '', timeOutYesterday: '', totalWorkingTime: '', userOffice: '' };

  readonly onlyme_columns = [
    'office',
    'date',
    'day',
    'timeIn',
    'timeOut',
    'totalWorkingTime',
    'workingDay',
    'ot',
    'onsiteDay',
    'leave',
    'action',
  ];
  readonly everyone_columns = [
    'cif',
    'fullName',
    'office',
    'date',
    'day',
    'timeIn',
    'timeOut',
    'totalWorkingTime',
    'workingDay',
    'action',
  ];

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workingHourService: WorkingHourService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getWorkingHourTime();
    this.userInfo = this.authService.get('userInfo');
    this.searchForm = this.formBuilder.group<SearchWorkingHour>({
      name: '',
    });
    combineLatest([this.page$, this.perPageSubject, this.searchWorkingHour])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage, search]) => {
          return this.workingHourService.getWorkingHourOnlyMe(page - 1, perpage, search, this.userInfo.userId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.workingHourDataOnlyMe = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.detectChanges();
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

  onPage(page: number): void {
    this.page$.next(page + 1);
  }

  onSize(size: number): void {
    this.perPageSubject.next(size);
  }

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
          this.myWorkingHour.totalWorkingTime = item.data.items[0].totalWorkingTime;
        }

        if (item.data?.items[0]?.userInfo?.office?.name) {
          this.myWorkingHour.userOffice = item.data?.items[0].userInfo.office.name;
        }
        this.cdr.detectChanges();
      });
  }

  secondsToTime = (secs: any) => {
    const hours = Math.floor(secs / (60 * 60));
    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);
    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds);
    const obj = {
      h: hours === 0 ? '00' : hours < 10 ? `0${hours}` : hours,
      m: minutes === 0 ? '00' : minutes < 10 ? `0${minutes}` : minutes,
      s: seconds,
    };
    return obj.h + ': ' + obj.m;
  };
}
