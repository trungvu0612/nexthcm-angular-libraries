import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';

import { CronTabSingleSegmentComponent } from '../../../abstract/cron-tab-single-segment.abstract';
import { CronLocalization } from '../../../models';
import { CRON_LOCALIZATION } from '../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-year',
  templateUrl: './quartz-cron-year.component.html',
  styleUrls: ['./quartz-cron-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronYearComponent extends CronTabSingleSegmentComponent {
  readonly yearCodes = CoreService.getList(Segment.year, true);
  readonly years = CoreService.getList(Segment.year);
  readonly api = this.cronUI.getApi<Type.YEAR>(Type.YEAR);

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(Type.YEAR, localization$);
  }
}
