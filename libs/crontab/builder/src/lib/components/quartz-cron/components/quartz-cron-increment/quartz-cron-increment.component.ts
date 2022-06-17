import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CronJobsSelectOption, Mode } from '@sbzen/cron-core';
import { TuiContextWithImplicit, TuiDestroyService, tuiPure } from '@taiga-ui/cdk';
import { TuiHandler } from '@taiga-ui/cdk/types/handler';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-quartz-cron-increment',
  templateUrl: './quartz-cron-increment.component.html',
  styleUrls: ['./quartz-cron-increment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class QuartzCronIncrementComponent implements OnInit, OnChanges {
  incrementControl = new UntypedFormControl(false);
  @Output() selected = new EventEmitter<void>();
  @Output() primaryValueChanged = new EventEmitter<string>();
  @Output() secondaryValueChanged = new EventEmitter<string>();
  @Input() segmentId = '';
  @Input() checked = false;
  @Input() disabledControls = false;
  @Input() label? = '';
  @Input() label2? = '';
  @Input() label3? = '';
  @Input() primaryValue = '';
  @Input() primaryOptions: CronJobsSelectOption[] = [];
  @Input() secondaryValue = '';
  @Input() secondaryOptions: CronJobsSelectOption[] = [];
  @Input() select1WidthClass = '';
  @Input() select2WidthClass = '';
  mode = Mode.INCREMENT;

  constructor(private readonly destroy$: TuiDestroyService) {}

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.incrementControl.disable();
    } else {
      this.incrementControl.enable();
    }
  }

  @tuiPure
  stringify(items: ReadonlyArray<CronJobsSelectOption>): TuiHandler<TuiContextWithImplicit<string>, string> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  ngOnInit(): void {
    this.incrementControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selected.emit();
      this.incrementControl.setValue(this.checked, { emitEvent: false });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('checked' in changes) {
      this.incrementControl.setValue(this.checked, { emitEvent: false });
    }
  }
}
