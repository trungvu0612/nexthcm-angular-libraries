import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { JobTitlesEffects, WorkflowsEffects } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import {
  BaseFormComponentModule,
  FormlySelectOrgTreeComponentModule,
  FormlyStatusToggleComponentModule,
  FormlyUserComboBoxComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { AdminLeaveConfigsService } from './admin-leave-configs.service';
import { UpsertLeaveApprovalLevelDialogComponent } from './components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { UpsertLeaveEntitlementDialogComponent } from './components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { UpsertLeaveTypeDialogComponent } from './components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import { EmployeeLeaveEntitlementManagementComponent } from './pages/employee-leave-entitlement-management/employee-leave-entitlement-management.component';
import { LeaveEntitlementManagementComponent } from './pages/leave-entitlement-management/leave-entitlement-management.component';
import { LeaveLevelApprovalManagementComponent } from './pages/leave-level-approval-management/leave-level-approval-management.component';
import { LeaveTypeManagementComponent } from './pages/leave-type-management/leave-type-management.component';
import { BaseObjectsPipe } from './pipes/base-objects.pipe';

export const ADMIN_LEAVE_CONFIGS_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_LEAVE_CONFIG', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'types' },
      { path: 'types', component: LeaveTypeManagementComponent },
      { path: 'employee-entitlements', component: EmployeeLeaveEntitlementManagementComponent },
      { path: 'entitlements', component: LeaveEntitlementManagementComponent },
      { path: 'levels-approval', component: LeaveLevelApprovalManagementComponent },
    ],
  },
];
const TABS: MenuItem[] = [
  { title: 'leaveConfigs.leaveType', route: '/admin/leave-configs/types', permissions: [] },
  { title: 'leaveConfigs.leaveEntitlement', route: '/admin/leave-configs/entitlements', permissions: [] },
  {
    title: 'leaveConfigs.employeeLeaveEntitlements',
    route: '/admin/leave-configs/employee-entitlements',
    permissions: [],
  },
  { title: 'leaveConfigs.leaveLevelApproval', route: '/admin/leave-configs/levels-approval', permissions: [] },
];

@NgModule({
  declarations: [
    UpsertLeaveTypeDialogComponent,
    LeaveTypeManagementComponent,
    UpsertLeaveEntitlementDialogComponent,
    UpsertLeaveApprovalLevelDialogComponent,
    LeaveEntitlementManagementComponent,
    LeaveLevelApprovalManagementComponent,
    EmployeeLeaveEntitlementManagementComponent,
    BaseObjectsPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_LEAVE_CONFIGS_ROUTES),
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
    FormlySelectOrgTreeComponentModule,
    BaseFormComponentModule,
    TuiLetModule,
    AkitaNgEffectsModule.forFeature([WorkflowsEffects, JobTitlesEffects]),
    FormlyModule,
    NgxPermissionsModule,
    FormsModule,
    FormlyStatusToggleComponentModule,
    InputFilterComponentModule,
    TranslocoLocaleModule,
    TuiPrimitiveCheckboxModule,
  ],
  providers: [
    AdminLeaveConfigsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'leaveConfigs',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
    { provide: HEADER_TABS, useValue: TABS },
  ],
})
export class AdminLeaveConfigsModule {}
