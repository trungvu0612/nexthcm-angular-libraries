import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OverviewService } from '../../services/overview.service';
import { AuthService } from '@nexthcm/auth';

@Component({
  selector: 'hcm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit {
  myId = this.authService.get('userInfo').userId;
  statusChecking: any;
  fingerCheck = false;
  dataChecking: any;

  constructor(private overviewServide: OverviewService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.overviewServide.statusChecking(this.myId).subscribe((item) => {
      console.log(item);
    });
  }

  fingerStatus() {
    this.fingerCheck = !this.fingerCheck;
  }

  checkingTime(checkingType:string) {
    const today = new Date();
    const timeChecking = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + today.getSeconds();
    this.dataChecking = {
      'trackingDate': today.valueOf(),
      'lastAction' : checkingType
    };
    if(checkingType=='check-in') {
      this.dataChecking.checkinFrom = "web-app";
      this.dataChecking.inTime = timeChecking;
      this.overviewServide.checkIn(this.dataChecking).subscribe((item) => {
        console.log(item);
      });
    }
    if(checkingType=='checked-out') {
      this.dataChecking.checkoutFrom = "web-app";
      this.dataChecking.outTime = timeChecking;
      this.overviewServide.checkOut(this.dataChecking, this.myId).subscribe((item) => {
        console.log(item);
      });
    }
  }
}
