import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Status } from '../../models';

@Component({
  selector: 'hcm-add-status-dropdown-button',
  templateUrl: './add-status-dropdown-button.component.html',
  styleUrls: ['./add-status-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStatusDropdownButtonComponent {
  @Input() addedStatus: Status[] = [];
  @Output() selectStatus = new EventEmitter<Status>();

  open = false;
  value: Status | null = null;

  onAdd(value: Status | null): void {
    this.value = null;
    this.open = false;
    this.selectStatus.emit(value as Status);
  }
}
