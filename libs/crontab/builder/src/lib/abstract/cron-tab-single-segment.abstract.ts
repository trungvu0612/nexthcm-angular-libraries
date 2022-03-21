import { Directive, Inject, ViewChild } from '@angular/core';
import { Segment, Type } from '@sbzen/cron-core';
import { Observable } from 'rxjs';

import { CronLocalization, CronSingleType } from '../models';
import { CronAndComponent } from '../shared/cron-and/cron-and.component';
import { CRON_LOCALIZATION } from '../tokens';
import { CronTabComponent } from './cron-tab.abstract';

@Directive()
export abstract class CronTabSingleSegmentComponent extends CronTabComponent {
  @ViewChild(CronAndComponent, { static: true }) and: CronAndComponent | null = null;
  readonly segments: Segment[];

  protected constructor(tab: CronSingleType, @Inject(CRON_LOCALIZATION) localization$: Observable<CronLocalization>) {
    super(localization$);
    this.segments = CronTabSingleSegmentComponent.getSegments(tab);
  }

  private static getSegments(tab: CronSingleType): Segment[] {
    const segment = new Map<CronSingleType, Segment>([
      [Type.HOURS, Segment.hours],
      [Type.MINUTES, Segment.minutes],
      [Type.MONTH, Segment.month],
      [Type.SECONDS, Segment.seconds],
      [Type.YEAR, Segment.year],
    ]).get(tab) as Segment;

    return [segment];
  }

  protected override applyChanges(): void {
    if (this.and) {
      this.and.detectChanges();
    }
    super.applyChanges();
  }
}
