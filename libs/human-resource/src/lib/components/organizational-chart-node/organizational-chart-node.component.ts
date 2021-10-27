import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
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

  open = false;

  constructor(readonly elementRef: ElementRef) {}
}
