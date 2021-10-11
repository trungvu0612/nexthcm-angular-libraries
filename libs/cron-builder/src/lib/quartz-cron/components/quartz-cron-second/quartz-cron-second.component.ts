import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';
import { CronTabSingleSegmentComponent } from '../../../abstract/cron-tab-single-segment.abstract';
import { CronLocalization } from '../../../models';
import { CRON_LOCALIZATION } from '../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-second',
  templateUrl: './quartz-cron-second.component.html',
  styleUrls: ['./quartz-cron-second.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronSecondComponent extends CronTabSingleSegmentComponent {
  readonly secondCodes = CoreService.getList(Segment.seconds, true);
  readonly seconds = CoreService.getList(Segment.seconds);
  readonly api = this.cronUI.getApi<Type.SECONDS>(Type.SECONDS);

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(Type.SECONDS, localization$);
  }
}
