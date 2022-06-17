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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Mode } from '@sbzen/cron-core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-cron-every',
  templateUrl: './cron-every.component.html',
  styleUrls: ['./cron-every.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CronEveryComponent implements OnInit, OnChanges {
  everyControl = new FormControl(false);
  @Output() selected = new EventEmitter<void>();
  @Input() checked = false;
  @Input() label? = '';
  @Input() segmentId = '';
  mode = Mode.EVERY;

  constructor(private readonly destroy$: TuiDestroyService) {}

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.everyControl.disable();
    } else {
      this.everyControl.enable();
    }
  }

  ngOnInit(): void {
    this.everyControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selected.emit();
      this.everyControl.setValue(this.checked, { emitEvent: false });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('checked' in changes) {
      this.everyControl.setValue(this.checked, { emitEvent: false });
    }
  }
}

@NgModule({
  imports: [TuiCheckboxModule, ReactiveFormsModule],
  declarations: [CronEveryComponent],
  exports: [CronEveryComponent],
})
export class CronEveryComponentModule {}
