import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Zone } from '@nexthcm/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { WorkingHourService } from '../../../services/working-hour.service';

@Component({
  selector: 'hcm-working-hour-detail',
  templateUrl: './working-hour-detail.component.html',
  styleUrls: ['./working-hour-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHourDetailComponent implements OnInit {
  id = this.context.data || '';
  workingData: any;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<Partial<Zone> | null, Partial<Zone> | null>,
    private workingHourService: WorkingHourService
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.workingHourService.getWorkingHourDetail(this.id).subscribe((item) => {
        this.workingData = item;
        console.log(this.workingData);
        if(this.workingData.data?.inTime){
          this.workingData.data.inTime = this.secondsToTime(this.workingData.data.inTime);
        }
        if(this.workingData.data?.outTime){
          this.workingData.data.outTime = this.secondsToTime(this.workingData.data.outTime);
        }
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
}
