import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AvatarComponentModule, FormlyUserComboBoxComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiDropdownHoverModule, TuiIslandModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OrganizationalChartNodeComponent } from './components/organizational-chart-node/organizational-chart-node.component';
import { ScrollIntoViewDirective } from './directives/scroll-into-view/scroll-into-view.directive';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { HumanResourceService } from './services/human-resource.service';

export const humanResourceRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_HUMAN_RESOURCE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'org-chart' },
      { path: 'org-chart', component: OrganizationalChartComponent },
    ],
  },
];

@NgModule({
  declarations: [OrganizationalChartComponent, ScrollIntoViewDirective, OrganizationalChartNodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(humanResourceRoutes),
    ReactiveFormsModule,
    TuiIslandModule,
    TuiLinkModule,
    LayoutModule,
    TranslocoModule,
    FormlyModule,
    TuiLetModule,
    AvatarComponentModule,
    TuiSvgModule,
    TuiLoaderModule,
    FormlyUserComboBoxComponentModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDropdownHoverModule,
  ],
  providers: [HumanResourceService],
})
export class HumanResourceModule {}
