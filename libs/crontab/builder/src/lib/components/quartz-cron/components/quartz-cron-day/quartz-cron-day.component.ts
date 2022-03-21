import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CoreService, CronQuartzUIService, Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CronTabComponent } from '../../../../abstract/cron-tab.abstract';
import { CronLocalization } from '../../../../models';
import { CRON_LOCALIZATION } from '../../../../tokens';

@Component({
  selector: 'hcm-quartz-cron-day',
  templateUrl: './quartz-cron-day.component.html',
  styleUrls: ['./quartz-cron-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuartzCronDayComponent extends CronTabComponent {
  readonly api = this.cronUI.getApi<Type.DAY>(Type.DAY);
  readonly segment = Segment;
  readonly segments = [Segment.dayOfMonth, Segment.dayOfWeek];

  readonly daysOfWeekEvery = CoreService.getList(Segment.dayOfWeek, true);
  readonly daysOfWeek = CoreService.getList(Segment.dayOfWeek);
  readonly daysOfWeekLast = CoreService.getList(Segment.dayOfWeek).map(({ label, value }) => ({
    label: label,
    value: `${value}L`,
  }));
  readonly daysOfWeekCodes = CoreService.getDaysOfWeekCodes();
  readonly localizeDaysOfWeekList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.daysOfWeek, localization.common.dayOfWeek)),
    shareReplay(1)
  );
  readonly localizeDaysOfWeekLastList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.daysOfWeekLast, localization.common.dayOfWeek)),
    shareReplay(1)
  );
  readonly localizeDaysOfWeekCodesList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.daysOfWeekCodes, localization.common.dayOfWeek)),
    shareReplay(1)
  );

  readonly daysOfMonthEvery = CoreService.getList(Segment.dayOfMonth, true);
  readonly daysOfMonth = CoreService.getList(Segment.dayOfMonth);
  readonly daysBeforeEndMonth = this.daysOfMonth.map(({ label, value }) => ({
    label: label,
    value: `L-${value}`,
  }));
  readonly nearestWeekDayOfMonth = this.daysOfMonthEvery.map(({ label, value }) => ({
    label: label,
    value: `${value}W`,
  }));
  readonly limitedDaysOfMonth = this.daysOfMonthEvery.slice(0, 5);
  readonly localizeDaysOfMonthEveryList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.daysOfMonthEvery, localization.common.dayOfMonth)),
    shareReplay(1)
  );
  readonly localizeLimitedDaysOfMonthEveryList$ = this.localizeDaysOfMonthEveryList$.pipe(
    map((localizeDaysOfMonthEveryList) => localizeDaysOfMonthEveryList.slice(0, 5)),
    shareReplay(1)
  );
  readonly localizeNearestWeekDayOfMonthList$ = this.localization$.pipe(
    map((localization) => this.localizeList(this.nearestWeekDayOfMonth, localization.common.dayOfMonth)),
    shareReplay(1)
  );

  constructor(
    readonly cronUI: CronQuartzUIService,
    protected readonly cd: ChangeDetectorRef,
    @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>
  ) {
    super(localization$);
  }
}
