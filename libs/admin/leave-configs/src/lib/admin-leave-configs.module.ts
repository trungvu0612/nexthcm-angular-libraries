import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import {
  BaseFormComponentModule,
  FormlyUserComboBoxComponentModule,
  HEADER_TABS,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UpsertLeaveApprovalLevelDialogComponent } from './components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { UpsertLeaveEntitlementDialogComponent } from './components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { UpsertLeavePeriodDialogComponent } from './components/upsert-leave-period-dialog/upsert-leave-period-dialog.component';
import { UpsertLeaveTypeDialogComponent } from './components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import { LeaveConfigsService } from './leave-configs.service';
import { LeaveApprovalLevelManagementComponent } from './pages/leave-approval-level-management/leave-approval-level-management.component';
import { LeaveEntitlementManagementComponent } from './pages/leave-entitlement-management/leave-entitlement-management.component';
import { LeavePeriodManagementComponent } from './pages/leave-period-management/leave-period-management.component';
import { LeaveTypeManagementComponent } from './pages/leave-type-management/leave-type-management.component';

export const adminLeaveTypesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_LEAVE_TYPE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'types' },
      {
        path: 'types',
        component: LeaveTypeManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
      },
      {
        path: 'periods',
        component: LeavePeriodManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
      },
      {
        path: 'entitlements',
        component: LeaveEntitlementManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
      },
      {
        path: 'approval-levels',
        component: LeaveApprovalLevelManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
      },
    ],
  },
];
const TABS: MenuItem[] = [
  { label: 'leaveTypes', link: '/admin/leave-configs/types', permissions: [] },
  { label: 'leavePeriods', link: '/admin/leave-configs/periods', permissions: [] },
  { label: 'leaveEntitlements', link: '/admin/leave-configs/entitlements', permissions: [] },
  { label: 'leaveApprovalLevels', link: '/admin/leave-configs/approval-levels', permissions: [] },
];

@NgModule({
  declarations: [
    UpsertLeaveTypeDialogComponent,
    LeaveTypeManagementComponent,
    UpsertLeavePeriodDialogComponent,
    UpsertLeaveEntitlementDialogComponent,
    UpsertLeaveApprovalLevelDialogComponent,
    LeavePeriodManagementComponent,
    LeaveEntitlementManagementComponent,
    LeaveApprovalLevelManagementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminLeaveTypesRoutes),
    TuiTablePaginationModule,
    TuiButtonModule,
    TableModule,
    TuiTagModule,
    TuiLoaderModule,
    TranslocoModule,
    ReactiveFormsModule,
    LayoutModule,
    TuiTabsModule,
    FormlyUserComboBoxComponentModule,
    BaseFormComponentModule,
    TuiLetModule,
  ],
  providers: [LeaveConfigsService, { provide: HEADER_TABS, useValue: TABS }],
})
export class AdminLeaveConfigsModule {}