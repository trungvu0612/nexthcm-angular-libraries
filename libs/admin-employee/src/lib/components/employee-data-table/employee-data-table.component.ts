import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { User } from '../../models/user';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-employee-data-table',
  templateUrl: './employee-data-table.component.html',
  styleUrls: ['./employee-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<User>[];

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private AdminEmployeeService: AdminEmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  deleteUser(userId: string | undefined) {
    this.AdminEmployeeService.deleteEmployee(userId).subscribe((res) => {
      console.log(res);
    });
  }
}
