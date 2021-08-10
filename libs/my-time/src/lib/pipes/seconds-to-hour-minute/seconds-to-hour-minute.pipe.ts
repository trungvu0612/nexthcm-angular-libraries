import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { TimeUtils } from '../../modules/utils/time-util';

@Pipe({
  name: 'secondsToHourMinute'
})
export class SecondsToHourMinutePipe implements PipeTransform {

  transform(seconds: number | undefined | null): string {
    return TimeUtils.getHourMinuteStringBySeconds(seconds);
  }

}

@NgModule({
  declarations: [SecondsToHourMinutePipe],
  exports: [SecondsToHourMinutePipe]
})
export class SecondsToHourMinutePipeModule {
}
