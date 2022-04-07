import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-export-employees-dialog',
  templateUrl: './export-employees-dialog.component.html',
  styleUrls: ['./export-employees-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportEmployeesDialogComponent {
  constructor() {}
}
