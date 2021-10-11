import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@ngneat/reactive-forms';
import { CronJobsSelectOption, Mode } from '@sbzen/cron-core';
import { TuiContextWithImplicit, TuiDestroyService, tuiPure } from '@taiga-ui/cdk';
import { TuiHandler } from '@taiga-ui/cdk/types/handler';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxModule, TuiSelectModule } from '@taiga-ui/kit';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-cron-range',
  templateUrl: './cron-range.component.html',
  styleUrls: ['./cron-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CronRangeComponent implements OnInit, OnChanges {
  rangeControl = new FormControl<boolean>(false);
  @Output() selected = new EventEmitter<void>();
  @Output() primaryValueChanged = new EventEmitter<string>();
  @Output() secondaryValueChanged = new EventEmitter<string>();
  @Input() segmentId = '';
  @Input() checked = false;
  @Input() disabledControls = false;
  @Input() label? = '';
  @Input() label2? = '';
  @Input() primaryValue = '';
  @Input() primaryOptions: CronJobsSelectOption[] = [];
  @Input() secondaryValue = '';
  @Input() secondaryOptions: CronJobsSelectOption[] = [];
  @Input() select1WidthClass = 'w-16';
  @Input() select2WidthClass = 'w-16';
  mode = Mode.RANGE;

  constructor(private readonly destroy$: TuiDestroyService) {}

  @Input() set disabled(disable: boolean) {
    this.rangeControl.setDisable(disable);
  }

  @tuiPure
  stringify(items: ReadonlyArray<CronJobsSelectOption>): TuiHandler<TuiContextWithImplicit<string>, string> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  ngOnInit(): void {
    this.rangeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selected.emit();
      this.rangeControl.setValue(this.checked, { emitEvent: false });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('checked' in changes) {
      this.rangeControl.setValue(this.checked, { emitEvent: false });
    }
  }
}

@NgModule({
  imports: [
    TuiCheckboxModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiDataListModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [CronRangeComponent],
  exports: [CronRangeComponent],
})
export class CronRangeComponentModule {}
