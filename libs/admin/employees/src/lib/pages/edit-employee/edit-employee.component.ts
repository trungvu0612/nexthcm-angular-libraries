import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeComponent {
  activeItemIndex = 0;
  readonly items = [
    { caption: 'employeeManagement', routerLink: '/admin/employees' },
    { caption: 'employees.editEmployee', routerLink: [] },
  ];
}
