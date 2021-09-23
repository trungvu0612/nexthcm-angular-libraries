import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseFormComponentModule,
  FormlyUserComboBoxComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MenuItem
} from '@nexthcm/ui';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiDropdownHoverModule, TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NodeChartComponent } from './components/node-chart/node-chart.component';
import { OrgChartComponent } from './components/org-chart/org-chart.component';
import { OrganizationChartComponent } from './pages/organization-chart/organization-chart.component';
import { HumanResourceService } from './services/human-resource.service';

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
  declarations: [OrganizationChartComponent, OrgChartComponent, NodeChartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(humanResourceRoutes),
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    TuiAvatarModule,
    TuiLetModule,
    FormlyModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiActiveZoneModule,
    TuiDropdownModule,
    TuiDropdownHoverModule,
    PolymorpheusModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TranslocoModule,
    SvgIconsModule,
    TuiScrollbarModule,
    FormlyUserComboBoxComponentModule,
    InputFilterComponentModule,
    BaseFormComponentModule,
    LayoutModule,
    TuiLoaderModule
  ],
  entryComponents: [OrgChartComponent, NodeChartComponent],
  providers: [{ provide: HEADER_TABS, useValue: TABS }, HumanResourceService],
})
export class HumanResourceModule {}
