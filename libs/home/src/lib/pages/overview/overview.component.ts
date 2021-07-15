import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OverviewService } from '../../services/overview.service';
import { AuthService } from '@nexthcm/auth';

@Component({
  selector: 'hcm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class OverviewComponent implements OnInit {
  myId = this.authService.get('userInfo').userId;
  fingerCheck = true;
  idChecking: any;
  dataChecking: any;
  checkingAction: any;

  constructor(private overviewServide: OverviewService,
              private authService: AuthService,
              private datePipe: DatePipe,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    this.overviewServide.statusChecking(this.myId, myDate).subscribe((item) => {
      this.checkingAction = item.data?.items[0].lastAction;
      this.idChecking = item.data?.items[0].id;
      console.log(this.checkingAction);
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
    if (checkingType == 'check-in') {
      this.dataChecking.checkinFrom = 'web-app';
      this.dataChecking.inTime = timeChecking;
      this.overviewServide.checkIn(this.dataChecking).subscribe((item) => {
        console.log(item);
      });
    }
    if (checkingType == 'checked-out') {
      this.dataChecking.checkoutFrom = 'web-app';
      this.dataChecking.outTime = timeChecking;
      this.overviewServide.checkOut(this.dataChecking, this.idChecking).subscribe((item) => {
        console.log(item);
        console.log(item);
      });
    }
    this.cdr.detectChanges();
  }
}
