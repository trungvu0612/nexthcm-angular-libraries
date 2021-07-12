import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-upsert-employee',
  templateUrl: './upsert-employee.component.html',
  styleUrls: ['./upsert-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEmployeeComponent {
  activeItemIndex = 0;
}
