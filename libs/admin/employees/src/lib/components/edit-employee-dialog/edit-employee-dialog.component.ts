import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeDialogComponent {
  activeItemIndex = 0;
}
