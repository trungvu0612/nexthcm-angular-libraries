import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EmployeeNode } from '../../models/employee-node';

@Component({
  selector: 'hcm-employee-node-detail',
  templateUrl: './employee-node-detail.component.html',
  styleUrls: ['./employee-node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeNodeDetailComponent implements OnInit {
  @Input() data = {} as EmployeeNode;

  constructor() {}

  ngOnInit(): void {}
}
