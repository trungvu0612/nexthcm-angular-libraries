import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CronJobsSelectOption, Mode } from '@sbzen/cron-core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-cron-and',
  templateUrl: './cron-and.component.html',
  styleUrls: ['./cron-and.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CronAndComponent implements OnInit, OnChanges {
  mode = Mode.AND;
  andControl = new FormControl(false);
  @Output() selected = new EventEmitter<void>();
  @Input() checked = false;
  @Input() disabledControls = false;
  @Input() gridSize = 'grid-cols-12';
  @Input() label? = '';
  @Input() segmentId = '';
  @Input() options: CronJobsSelectOption[] = [];

  constructor(private readonly cd: ChangeDetectorRef, private readonly destroy$: TuiDestroyService) {}

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.andControl.disable();
    } else {
      this.andControl.enable();
    }
  }

  @Input() isValueSelected: (value: string) => boolean = () => false;

  @Input() selectValue: (value: string) => boolean = () => false;

  changeValue(value: string): void {
    this.selectValue(value);
    // this.cd.markForCheck();
  }

  detectChanges(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.andControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selected.emit();
      this.andControl.setValue(this.checked, { emitEvent: false });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('checked' in changes) {
      this.andControl.setValue(this.checked, { emitEvent: false });
    }
  }
}
