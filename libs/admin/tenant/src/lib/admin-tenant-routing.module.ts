import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { AuthGuard } from '@nexthcm/auth';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { AdminTenantComponent } from './admin-tenant.component';
import { SuperUserGuard } from './guards/super-user.guard';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TenantListComponent, canActivate: [SuperUserGuard] },
      { path: 'add', component: UpsertTenantComponent, canActivate: [SuperUserGuard] },
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTenantRoutingModule {}
