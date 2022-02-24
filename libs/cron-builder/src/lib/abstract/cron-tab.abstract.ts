import { ChangeDetectorRef, Directive, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { CronJobsSelectOption, CronUIBaseService, Mode, Segment } from '@sbzen/cron-core';
import { Observable } from 'rxjs';

import { CronLocalization } from '../models';
import { CRON_LOCALIZATION } from '../tokens';

@Directive()
export abstract class CronTabComponent implements OnInit, OnDestroy {
  @Output() changed = new EventEmitter<never>();
  abstract readonly cronUI: CronUIBaseService;
  readonly mode = Mode;
  protected abstract readonly segments: Segment[];
  protected abstract readonly cd: ChangeDetectorRef;
  private readonly sessionId = Date.now().toString();
  private unListener?: (() => void) | null;

  protected constructor(@Inject(CRON_LOCALIZATION) readonly localization$: Observable<CronLocalization>) {}

  ngOnInit(): void {
    this.unListener = this.cronUI.listen(this.segments, () => {
      this.cd.detectChanges();
      this.applyChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.unListener) {
      this.unListener();
    }
  }

  genId(mode: Mode, extra = ''): string {
    return `${mode}-${extra}${this.sessionId}`;
  }

  localizeList(list: CronJobsSelectOption[], localizationStore: { [key: string]: string }): CronJobsSelectOption[] {
    return list.map((v) => ({
      ...v,
      label: this.localizeLabel(v.label, localizationStore),
    }));
  }

  localizeLabel(label: string, localizationStore: { [key: string]: string }): string {
    return localizationStore[label.toLowerCase()];
  }

  protected applyChanges(): void {
    this.changed.emit();
  }
}
