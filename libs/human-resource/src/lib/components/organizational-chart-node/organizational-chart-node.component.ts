import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeNode } from '../../models/employee-node';

@Component({
  selector: 'hcm-organizational-chart-node',
  templateUrl: './organizational-chart-node.component.html',
  styleUrls: ['./organizational-chart-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalChartNodeComponent {
  @Input() node!: EmployeeNode;
  @Input() active = false;

  readonly open$ = new BehaviorSubject<boolean | null>(false);
  open = false;

  onMouseEnter(): void {
    this.open$.next(null);
    setTimeout(() => {
      // handle mouse leave
      if (this.open$.value === null) {
        this.open$.next(true);
      }
    }, 500);
  }

  onMouseLeave(): void {
    this.open$.next(false);
  }
}
