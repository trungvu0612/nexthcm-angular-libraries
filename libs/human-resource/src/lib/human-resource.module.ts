import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HEADER_TABS, LayoutComponent, MenuItem } from '@nexthcm/ui';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiDropdownHoverModule, TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EmployeeNodeDetailComponent } from './components/employee-node-detail/employee-node-detail.component';
import { EmployeeNodeComponent } from './components/employee-node/employee-node.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';

export const humanResourceRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'HUMAN_RESOURCE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'organization-chart' },
      { path: 'organization-chart', component: OrganizationChartComponent },
    ],
  },
];
const TABS: MenuItem[] = [{ label: 'organizationChart', link: '/human-resource/organization-chart', permissions: [] }];

@NgModule({
  declarations: [OrganizationChartComponent, OrgChartComponent, EmployeeNodeComponent, EmployeeNodeDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(humanResourceRoutes),
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    TuiAvatarModule,
    TuiLetModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiActiveZoneModule,
    TuiDropdownModule,
    TuiDropdownHoverModule,
    PolymorpheusModule,
  ],
  providers: [{ provide: HEADER_TABS, useValue: TABS }],
})
export class HumanResourceModule {}
