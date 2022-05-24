import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { EmployeeNode } from '../../models/employee-node';

@Component({
  selector: 'hcm-organizational-chart-node',
  templateUrl: './organizational-chart-node.component.html',
  styleUrls: ['./organizational-chart-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalChartNodeComponent {
  @Input() node!: EmployeeNode;
  @Input() isActive = false;
  @Output() clickNode = new EventEmitter();

  open = false;

  constructor(readonly elementRef: ElementRef) {}
}
