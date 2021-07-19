import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetStatusPipeModule, LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiIslandModule, TuiSliderModule, TuiTagModule } from '@taiga-ui/kit';
import { HeroIconModule, pencilAlt, trash, zoomIn } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminTenantComponent } from './admin-tenant.component';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import { AdminTenantService } from './services/admin-tenant.service';

export const adminTenantRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_TENANT', redirectTo: '/' } },
    children: [
      { path: '', component: TenantListComponent },
      {
        path: 'create',
        component: UpsertTenantComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_TENANT', redirectTo: '/' } },
      },
      {
        path: '',
        component: AdminTenantComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_TENANT', redirectTo: '/' } },
        children: [
          { path: 'information', component: UpsertTenantComponent },
          { path: 'domain', component: DomainListComponent },
          { path: 'organizational-structure', component: OrganizationalStructureComponent },
          { path: 'organizational-chart', component: OrganizationalChartComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    AdminTenantComponent,
    TenantListComponent,
    DomainListComponent,
    UpsertTenantComponent,
    OrganizationalStructureComponent,
    OrganizationalChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminTenantRoutes),
    ReactiveFormsModule,
    FormlyModule,
    TranslocoModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiInputModule,
    TuiSvgModule,
    GetStatusPipeModule,
    TuiTagModule,
    TuiTextfieldControllerModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiAvatarModule,
    TableModule,
    TuiScrollbarModule,
    TuiLetModule,
    HeroIconModule.withIcons({ pencilAlt, trash, zoomIn }),
    PromptComponentModule,
    TuiSliderModule,
  ],
  providers: [AdminTenantService],
})
export class AdminTenantModule {}
