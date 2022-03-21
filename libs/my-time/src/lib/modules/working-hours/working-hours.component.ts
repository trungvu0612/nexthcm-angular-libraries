import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { endOfToday, startOfToday } from 'date-fns';
import { map } from 'rxjs/operators';

import { MyTimeService } from '../../services';

@Component({
  selector: 'hcm-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHoursComponent {
  activeItemIndex = 0;
  readonly myTodayWorkingHours$ = this.myTimeService
    .getWorkingHoursOfOnlyMe(
      new HttpParams()
        .set('userId', this.authService.get('userInfo', 'userId'))
        .set('fromDate', startOfToday().valueOf())
        .set('toDate', endOfToday().valueOf())
    )
    .pipe(map((res) => res.items[0]));
  readonly monthWorkingTime$ = this.myTimeService.getWorkingTimeCurrentMonth();

  constructor(private myTimeService: MyTimeService, private authService: AuthService) {}
}
