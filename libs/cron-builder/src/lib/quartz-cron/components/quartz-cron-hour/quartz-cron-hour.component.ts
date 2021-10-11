import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';
import { CronTabSingleSegmentComponent } from '../../../abstract/cron-tab-single-segment.abstract';
import { CronLocalization } from '../../../models';
import { CRON_LOCALIZATION } from '../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-hour',
  templateUrl: './quartz-cron-hour.component.html',
  styleUrls: ['./quartz-cron-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronHourComponent extends CronTabSingleSegmentComponent {
  readonly hourCodes = CoreService.getList(Segment.hours, true);
  readonly hours = CoreService.getList(Segment.hours);
  readonly api = this.cronUI.getApi<Type.HOURS>(Type.HOURS);

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(Type.HOURS, localization$);
  }
}
