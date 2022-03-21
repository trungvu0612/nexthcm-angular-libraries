import { NgModule, Pipe, PipeTransform } from '@angular/core';
import cronValidator from 'cron-expression-validator';
import { Observable, of } from 'rxjs';

import { CommonService } from '../../services';

@Pipe({
  name: 'cronNextRunTime',
})
export class CronNextRunTimePipe implements PipeTransform {
  constructor(private readonly commonService: CommonService) {}

  transform(value: string): Observable<number | null> {
    return cronValidator.isValidCronExpression(value) ? this.commonService.getCronNextRunTime(value) : of(null);
  }
}

@NgModule({
  declarations: [CronNextRunTimePipe],
  imports: [],
  exports: [CronNextRunTimePipe],
})
export class CronNextRunTimePipeModule {}
