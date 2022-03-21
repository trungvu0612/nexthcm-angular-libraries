import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractTuiInteractive, tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiSizeL } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'hcm-cron-and-option',
  templateUrl: './cron-and-option.component.html',
  styleUrls: ['./cron-and-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CronAndOptionComponent extends AbstractTuiInteractive implements OnChanges {
  @Input()
  @HostBinding('attr.data-tui-host-size')
  @tuiDefaultProp()
  size: TuiSizeL = 'm';
  @Input() checked = false;
  @Input() label = '';
  @Input() disabled = false;
  @Output() selected = new EventEmitter<void>();
  readonly checked$ = new BehaviorSubject<boolean>(false);
  focused = false;

  ngOnChanges(changes: SimpleChanges): void {
    if ('checked' in changes) {
      this.checked$.next(this.checked);
    }
  }

  onSelected(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault();
    } else {
      this.selected.emit();
      this.checked$.next(this.checked);
    }
  }
}
