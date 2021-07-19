import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetStatusPipeModule, LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiIslandModule, TuiSliderModule, TuiTagModule } from '@taiga-ui/kit';
import { HeroIconModule, pencilAlt, trash, zoomIn } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { AdminTenantComponent } from './admin-tenant.component';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import { AdminTenantService } from './services/admin-tenant.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { SuperUserGuard } from './guards/super-user.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TenantListComponent, canActivate: [SuperUserGuard] },
      { path: 'create', component: UpsertTenantComponent, canActivate: [SuperUserGuard] },
      {
        path: '',
        component: AdminTenantComponent,
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
    RouterModule.forChild(routes),
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
