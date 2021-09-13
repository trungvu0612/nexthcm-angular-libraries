import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EmployeeNode } from '../../models/employee-node';

@Component({
  selector: 'hcm-employee-node',
  templateUrl: './employee-node.component.html',
  styleUrls: ['./employee-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeNodeComponent implements OnInit {
  @Input() data = {} as EmployeeNode;

  constructor() {}

  ngOnInit(): void {}
}
