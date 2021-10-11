import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CronQuartzUIService, QuartzService } from '@sbzen/cron-core';
import { CronHostComponent } from '../abstract/cron-host.abstract';

export function quartzCronServiceFactory(): CronQuartzUIService {
  return new CronQuartzUIService(new QuartzService());
}

@Component({
  selector: 'hcm-quartz-cron',
  templateUrl: './quartz-cron.component.html',
  styleUrls: ['./quartz-cron.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CronQuartzUIService,
      useFactory: quartzCronServiceFactory,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuartzCronComponent),
      multi: true,
    },
  ],
})
export class QuartzCronComponent extends CronHostComponent {
  constructor(cronQuartzUI: CronQuartzUIService) {
    super(cronQuartzUI);
  }
}
