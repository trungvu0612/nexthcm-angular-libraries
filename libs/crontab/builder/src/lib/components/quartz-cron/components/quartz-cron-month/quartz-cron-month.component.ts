import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CronTabSingleSegmentComponent } from '../../../../abstract/cron-tab-single-segment.abstract';
import { CronLocalization } from '../../../../models';
import { CRON_LOCALIZATION } from '../../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-month',
  templateUrl: './quartz-cron-month.component.html',
  styleUrls: ['./quartz-cron-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronMonthComponent extends CronTabSingleSegmentComponent {
  readonly monthCodes = CoreService.getMonthCodes();
  readonly months = CoreService.getList(Segment.month);
  readonly incrementPrimaryOptions = this.months.map((v, i) => ({
    ...v,
    label: String(i + 1),
  }));
  readonly api = this.cronUI.getApi<Type.MONTH>(Type.MONTH);
  readonly localizeMonthCodeList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.monthCodes, localization.common.month)),
    shareReplay(1)
  );
  readonly localizeMonthList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.months, localization.common.month)),
    shareReplay(1)
  );

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(Type.MONTH, localization$);
  }
}
