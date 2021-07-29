import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent, SelectOptionsModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputMonthModule,
  TuiMultiSelectModule,
  TuiTabsModule,
  TuiTagModule
} from '@taiga-ui/kit';
import { CreateLeaveEntitlementComponent } from './pages/list-entitlement/dialog/create-leave-entitlement/create-leave-entitlement.component';
import { CreateLeavePeriodComponent } from './pages/list-entitlement/dialog/create-leave-period/create-leave-period.component';
import { ListEntitlementComponent } from './pages/list-entitlement/list-entitlement.component';
import { TableLeavePeriodComponent } from './pages/list-entitlement/tab/table-leave-period/table-leave-period.component';
import { TableOverviewComponent } from './pages/list-entitlement/tab/table-overview/table-overview.component';
import { UpsertEntitlementComponent } from './pages/upsert-entitlement/upsert-entitlement.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormlySelectJobTitleEntitlementsComponent } from './components/formly-select-job-title-entitlements/formly-select-job-title-entitlements.component';

export const adminEntitlementRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    /*TODO need fix*/
    data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
    children: [
      { path: '', component: ListEntitlementComponent },
      { path: 'period', component: ListEntitlementComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminEntitlementRoutes),
    FormlyModule.forChild({ types: [{ name: 'select-permissions2', component: FormlySelectJobTitleEntitlementsComponent }] }),
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiTabsModule,
    TuiInputMonthModule,
    TuiTagModule,
    TuiButtonModule,
    RxReactiveFormsModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiLetModule,
    SelectOptionsModule,
  ],
  declarations: [
    ListEntitlementComponent,
    UpsertEntitlementComponent,
    TableOverviewComponent,
    TableLeavePeriodComponent,
    CreateLeaveEntitlementComponent,
    CreateLeavePeriodComponent,
    FormlySelectJobTitleEntitlementsComponent
  ],
  providers: [
    AdminPermissionsService,
  ]
})
export class AdminEntitlementModule {
}
