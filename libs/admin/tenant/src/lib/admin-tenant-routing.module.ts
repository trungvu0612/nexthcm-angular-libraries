import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { AdminTenantSummaryComponent } from './admin-tenant-summary.component';
import { SuperUserGuard } from './guards/super-user.guard';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import { AdminTenantComponent } from './admin-tenant.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AdminTenantSummaryComponent,
        children: [
          { path: '', component: TenantListComponent },
          { path: 'add', component: UpsertTenantComponent },
          { path: 'domain', component: DomainListComponent },
        ],
        canActivate: [SuperUserGuard],
      },
      {
        path: '',
        component: AdminTenantComponent,
        children: [
          { path: 'information', component: UpsertTenantComponent },
          { path: 'organizational-structure', component: OrganizationalStructureComponent },
          { path: 'organizational-chart', component: OrganizationalChartComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTenantRoutingModule {}
