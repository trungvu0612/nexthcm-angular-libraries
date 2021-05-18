import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EmployeeData } from '../../models/employees';

@Component({
  selector: 'hcm-employees-data-table',
  templateUrl: './employees-data-table.component.html',
  styleUrls: ['./employees-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<EmployeeData>[];

  constructor() {}

  ngOnInit(): void {}
}
