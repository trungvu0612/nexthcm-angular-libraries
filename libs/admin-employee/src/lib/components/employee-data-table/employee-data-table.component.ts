import { Component, OnInit, ChangeDetectionStrategy, Input, Injector, ChangeDetectorRef } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { EmployeeData } from '../../models/employee';
import { AdminEmployeeService } from '../../services/admin-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'hcm-employee-data-table',
  templateUrl: './employee-data-table.component.html',
  styleUrls: ['./employee-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<EmployeeData>[];

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
