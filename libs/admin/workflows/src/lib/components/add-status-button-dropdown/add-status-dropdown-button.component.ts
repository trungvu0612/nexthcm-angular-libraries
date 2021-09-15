import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Status } from '../../models';
import { AddStatusData } from '../../models/add-status-data';

@Component({
  selector: 'hcm-add-status-dropdown-button',
  templateUrl: './add-status-dropdown-button.component.html',
  styleUrls: ['./add-status-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStatusDropdownButtonComponent {
  @Input() addedStatus: Status[] = [];
  @Output() selectStatus = new EventEmitter<AddStatusData>();

  open = false;
  data: AddStatusData = { allowAll: false, status: null };

  onAdd(): void {
    this.open = false;
    this.selectStatus.emit(this.data);
    this.data.status = null;
  }

  onCancel(): void {
    this.data = { allowAll: false, status: null };
    this.open = false;
  }
}
