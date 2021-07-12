import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { EntitlementsComponent } from './entitlements.component';
import { ListEntitlementComponent } from './pages/list-entitlement/list-entitlement.component';
import { UpsertEntitlementComponent } from './pages/upsert-entitlement/upsert-entitlement.component';
import { LayoutComponent } from '@nexthcm/ui';
import { AuthGuard } from '@nexthcm/auth';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiInputMonthModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableOverviewComponent } from './pages/list-entitlement/tab/table-overview/table-overview.component';
import { TableLeavePeriodComponent } from './pages/list-entitlement/tab/table-leave-period/table-leave-period.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CreateLeaveEntitlementComponent } from './pages/list-entitlement/dialog/create-leave-entitlement/create-leave-entitlement.component';
import { CreateLeavePeriodComponent } from './pages/list-entitlement/dialog/create-leave-period/create-leave-period.component';
import { FormlyModule } from '@ngx-formly/core';

export const adminEntitlementRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListEntitlementComponent },
      { path: 'add', component: UpsertEntitlementComponent },
      { path: ':id/edit', component: UpsertEntitlementComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(adminEntitlementRoutes),
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiTabsModule,
    TuiInputMonthModule,
    TuiTagModule,
    TuiButtonModule,
    RxReactiveFormsModule,
    FormlyModule
  ],
  declarations: [
    EntitlementsComponent,
    ListEntitlementComponent,
    UpsertEntitlementComponent,
    TableOverviewComponent,
    TableLeavePeriodComponent,
    CreateLeaveEntitlementComponent,
    CreateLeavePeriodComponent
  ],
})
export class AdminEntitlementModule {}
