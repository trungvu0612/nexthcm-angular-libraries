import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-employee-data-table',
  templateUrl: './employee-data-table.component.html',
  styleUrls: ['./employee-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDataTableComponent {
  @Input() columns!: string[];
  @Input() data!: Partial<User>[];

  constructor(private adminEmployeeService: AdminEmployeeService) {}

  deleteUser(userId?: string): void {
    if (userId) {
      this.adminEmployeeService.deleteEmployee(userId).subscribe();
    }
  }
}
