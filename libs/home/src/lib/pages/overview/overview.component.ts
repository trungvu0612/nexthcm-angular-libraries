import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptComponent } from '@nexthcm/ui';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { OverviewService } from '../../services/overview.service';
import { AuthService } from '@nexthcm/auth';

@Component({
  selector: 'hcm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, TuiDestroyService],
})
export class OverviewComponent implements OnInit {
  @ViewChild('prompt') prompt!: PromptComponent;
  myId = this.authService.get('userInfo').userId;
  fingerCheck = true;
  idChecking: any;
  dataChecking: any;
  checkingAction: any;

  constructor(
    private overviewService: OverviewService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    this.overviewService.statusChecking(this.myId, myDate).subscribe((item) => {
      if (item.data?.items.length > 0) {
        // show check-out button
        this.checkingAction = 'checked-out';
        this.idChecking = item.data?.items[0]?.id;
      } else {
        //show check-in button
        this.checkingAction = 'checked-in';
      }
      this.cdr.detectChanges();
    });
  }

  fingerStatus() {
    this.fingerCheck = !this.fingerCheck;
  }

  checkingTime(checkingType: string) {
    const today = new Date();
    const timeChecking = today.getHours() * 60 * 60 + today.getMinutes() * 60 + today.getSeconds();
    this.dataChecking = {
      trackingDate: today.valueOf(),
      lastAction: checkingType,
    };
    if (checkingType == 'checked-in') {
      this.dataChecking.checkinFrom = 'web-app';
      this.dataChecking.inTime = timeChecking;
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
          switchMap((options) => this.prompt.open(options)),
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
      this.dataChecking.outTime = timeChecking;
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
          switchMap((options) => this.prompt.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.checkingAction = 'checked-out';
          this.cdr.detectChanges();
          this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
        });
    }
  }
}
