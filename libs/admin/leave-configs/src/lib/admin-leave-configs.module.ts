import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { JobTitlesEffects, JoinByKeyPipeModule, OfficesEffects, WorkflowsEffects } from '@nexthcm/cdk';
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
import { NgStackFormsModule } from '@ng-stack/forms';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { AdminLeaveConfigsService } from './admin-leave-configs.service';
import { LeaveEntitlementFiltersComponent } from './components/leave-entitlement-filters/leave-entitlement-filters.component';
import { UpsertLeaveApprovalLevelDialogComponent } from './components/upsert-leave-approval-level-dialog/upsert-leave-approval-level-dialog.component';
import { UpsertLeaveEntitlementDialogComponent } from './components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { UpsertLeaveTypeDialogComponent } from './components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { EmployeeLeaveEntitlementManagementComponent } from './pages/employee-leave-entitlement-management/employee-leave-entitlement-management.component';
import { LeaveEntitlementManagementComponent } from './pages/leave-entitlement-management/leave-entitlement-management.component';
import { LeaveLevelApprovalManagementComponent } from './pages/leave-level-approval-management/leave-level-approval-management.component';
import { LeaveTypeManagementComponent } from './pages/leave-type-management/leave-type-management.component';
import { TRANSLATION_SCOPE } from './translation-scope';

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
  { title: 'leaveType', route: '/admin/leave-configs/types', permissions: [] },
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
    LeaveEntitlementFiltersComponent,
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
    NgStackFormsModule,
    LayoutModule,
    TuiTabsModule,
    FormlyUserComboBoxComponentModule,
    FormlySelectOrgTreeComponentModule,
    BaseFormComponentModule,
    TuiLetModule,
    AkitaNgEffectsModule.forFeature([WorkflowsEffects, JobTitlesEffects, OfficesEffects]),
    FormlyModule,
    NgxPermissionsModule,
    FormsModule,
    FormlyStatusToggleComponentModule,
    InputFilterComponentModule,
    TranslocoLocaleModule,
    TuiPrimitiveCheckboxModule,
    JoinByKeyPipeModule,
    FormlySelectOrgTreeComponentModule,
    PushModule,
  ],
  providers: [
    AdminLeaveConfigsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
    { provide: HEADER_TABS, useValue: TABS },
  ],
})
export class AdminLeaveConfigsModule {}
