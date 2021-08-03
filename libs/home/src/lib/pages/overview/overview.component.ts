import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { differenceInSeconds, endOfYesterday, startOfToday, startOfYesterday } from 'date-fns';
import { of } from 'rxjs';
import { catchError, filter, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { OverviewService } from '../../services/overview.service';

@Component({
  selector: 'hcm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, TuiDestroyService],
})
export class OverviewComponent implements OnInit {
  toDay = new Date();
  startOfYesterday = startOfYesterday().valueOf();
  endOfYesterday = endOfYesterday().valueOf();
  nowInMiliseconds = differenceInSeconds(this.toDay, startOfToday());
  myName = this.authService.get('userInfo').preferred_username;
  myId = this.authService.get('userInfo').userId;
  orgId = this.authService.get('userInfo').orgId;
  checkingBtn = true;
  fingerCheck = true;
  idChecking: any;
  dataChecking: any;
  checkingAction: any;
  myWorkingHour = { timeToday: '', timeInToday: '', timeOutToday: '', timeInYesterday: '', timeOutYesterday: '' };

  constructor(
    private overviewService: OverviewService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    console.log(this.authService.get('userInfo'));
    this.getWorkingHourTime();
    this.checkingStatus();
  }

  checkingStatus() {
    this.myWorkingHour.timeToday =
      new Date().toLocaleString('en-us', { month: 'short' }) + ' ' + String(new Date().getDate()).padStart(2, '0');
    this.overviewService.statusChecking().subscribe((item) => {
      if (item.data?.items.length > 0) {
        // show check-out button
        this.checkingAction = 'checked-out';
        this.idChecking = item.data?.items[0]?.id;
        if (item.data?.items[0]?.inTime) {
          this.myWorkingHour.timeInToday = this.secondsToTime(item.data?.items[0]?.inTime);
        }
        if (item.data?.items[0]?.outTime) {
          this.myWorkingHour.timeOutToday = this.secondsToTime(item.data?.items[0]?.outTime);
        }
      } else {
        //show check-in button
        this.checkingAction = 'checked-in';
      }
      this.cdr.detectChanges();
    });
  }

  getWorkingHourTime() {
    this.overviewService
      .getWorkingHourByDate(this.myId, this.startOfYesterday, this.endOfYesterday)
      .subscribe((item) => {
        if (item.data?.items[0]?.inTimeToFullTime) {
          this.myWorkingHour.timeInYesterday = item.data.items[0].inTimeToFullTime;
        }
        if (item.data?.items[0]?.outTimeToFulltime) {
          this.myWorkingHour.timeOutYesterday = item.data.items[0].outTimeToFulltime;
        }

        this.cdr.detectChanges();
      });
    this.overviewService.getTimeWorkingHour(this.orgId).subscribe((item) => {
      const toDay = new Date();
      if (this.nowInMiliseconds < item.data?.minStart || this.nowInMiliseconds > item.data?.maxStart) {
        this.fingerCheck = false;
        this.checkingBtn = false;
      }
      this.cdr.detectChanges();
    });
  }

  fingerStatus() {
    if (this.checkingBtn == true) {
      this.fingerCheck = !this.fingerCheck;
    }
  }

  checkingTime(checkingType: string) {
    this.dataChecking = {
      trackingDate: this.toDay,
      lastAction: checkingType,
    };
    if (checkingType == 'checked-in') {
      this.dataChecking.checkinFrom = 'web-app';
      this.dataChecking.inTime = this.nowInMiliseconds;
      this.overviewService
        .checkIn(this.dataChecking)
        .pipe(
          mapTo({ icon: 'success', text: 'Check In Successfully!' } as SweetAlertOptions),
          takeUntil(this.destroy$),
          catchError((err) =>
            of({
              icon: 'error',
              text: err.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((options) => this.promptService.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.checkingAction = 'checked-out';
          this.cdr.detectChanges();
          this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
        });
    }
    if (checkingType == 'checked-out') {
      this.dataChecking.checkoutFrom = 'web-app';
      this.dataChecking.outTime = this.nowInMiliseconds;
      this.overviewService
        .checkOut(this.dataChecking, this.idChecking)
        .pipe(
          mapTo({ icon: 'success', text: 'Check Out Successfully!' } as SweetAlertOptions),
          takeUntil(this.destroy$),
          catchError((err) =>
            of({
              icon: 'error',
              text: err.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((options) => this.promptService.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.checkingAction = 'checked-out';
          this.cdr.detectChanges();
          this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
          this.cdr.detectChanges();
        });
    }
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

  workingHourDetail() {
    this.router.navigateByUrl('/my-time/working-hour');
  }
}
