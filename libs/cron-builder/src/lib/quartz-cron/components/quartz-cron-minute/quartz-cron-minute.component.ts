import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';
import { CronTabSingleSegmentComponent } from '../../../abstract/cron-tab-single-segment.abstract';
import { CronLocalization } from '../../../models';
import { CRON_LOCALIZATION } from '../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-minute',
  templateUrl: './quartz-cron-minute.component.html',
  styleUrls: ['./quartz-cron-minute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronMinuteComponent extends CronTabSingleSegmentComponent {
  readonly minuteCodes = CoreService.getList(Segment.minutes, true);
  readonly minutes = CoreService.getList(Segment.minutes);
  readonly api = this.cronUI.getApi<Type.MINUTES>(Type.MINUTES);

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(Type.MINUTES, localization$);
  }
}
