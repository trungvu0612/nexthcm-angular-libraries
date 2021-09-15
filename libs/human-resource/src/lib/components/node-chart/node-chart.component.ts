import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { OrgChart } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-node-chart',
  templateUrl: './node-chart.component.html',
  styleUrls: ['./node-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeChartComponent implements OnInit, OnChanges {
  @Input() public description!: OrgChart;
  @Output() public hovered!: EventEmitter<void>;
  constructor(private humanResourceService: HumanResourceService) {
    this.description = this.humanResourceService.description;
    this.hovered = this.humanResourceService.hovered;
  }

  ngOnInit(): void {
    this.description = this.humanResourceService.description;
  }

  ngOnChanges(): void {
    // console.log('inside dynamic changes')
  }

  handleClick() {
    this.hovered.emit();
  }
}
