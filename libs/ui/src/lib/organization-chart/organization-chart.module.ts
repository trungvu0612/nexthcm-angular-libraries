import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';
import { ChartNodeComponent } from './components/chart-node/chart-node.component';
import { OrganizationChartComponent } from './organization-chart.component';

@NgModule({
  declarations: [ChartContainerComponent, ChartNodeComponent, OrganizationChartComponent],
  imports: [CommonModule],
  exports: [ChartContainerComponent],
})
export class OrganizationChartModule {}
