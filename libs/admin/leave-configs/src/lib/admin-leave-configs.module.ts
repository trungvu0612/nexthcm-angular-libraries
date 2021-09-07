import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { FormlyTaigaUiModule, FormlyUserComboBoxComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UpsertLeaveConfigComponent } from './components/upsert-leave-configs/upsert-leave-configs.component';
import { UpsertLeaveEntitlementComponent } from './components/upsert-leave-entitlement/upsert-leave-entitlement.component';
import { UpsertLeaveLevelApproveComponent } from './components/upsert-leave-level-approve/upsert-leave-level-approve.component';
import { UpsertLeavePeriodComponent } from './components/upsert-leave-period/upsert-leave-period.component';
import { LeaveConfigsComponent } from './leave-configs.component';
import { LeaveConfigsService } from './leave-configs.service';
import { ListLeaveConfigsComponent } from './pages/list-leave-configs/list-leave-configs.component';
import { ListLeaveEntitlementComponent } from './pages/list-leave-entitlement/list-leave-entitlement.component';
import { ListLeaveLevelApproveComponent } from './pages/list-leave-level-approve/list-leave-level-approve.component';
import { ListLeavePeriodComponent } from './pages/list-leave-period/list-leave-period.component';

export const adminLeaveTypesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_LEAVE_TYPE', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: LeaveConfigsComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'leave-type' },
          {
            path: 'leave-type',
            component: ListLeaveConfigsComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
          },
          {
            path: 'leave-period',
            component: ListLeavePeriodComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
          },
          {
            path: 'leave-entitlement',
            component: ListLeaveEntitlementComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
          },
          {
            path: 'leave-level-approve',
            component: ListLeaveLevelApproveComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    UpsertLeaveConfigComponent,
    LeaveConfigsComponent,
    ListLeaveConfigsComponent,
    UpsertLeavePeriodComponent,
    UpsertLeaveEntitlementComponent,
    UpsertLeaveLevelApproveComponent,
    ListLeavePeriodComponent,
    ListLeaveEntitlementComponent,
    ListLeaveLevelApproveComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminLeaveTypesRoutes),
    TuiTablePaginationModule,
    TuiButtonModule,
    TableModule,
    TuiTagModule,
    TuiLoaderModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    TranslocoModule,
    ReactiveFormsModule,
    LayoutModule,
    TuiTabsModule,
    PolymorpheusModule,
    FormlyUserComboBoxComponentModule
  ],
  providers: [LeaveConfigsService]
})
export class AdminLeaveConfigsModule {}
