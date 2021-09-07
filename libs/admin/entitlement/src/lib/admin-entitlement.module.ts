import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { FormlyUserComboBoxComponentModule, LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputMonthModule,
  TuiMultiSelectModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListEntitlementComponent } from './pages/list-entitlement/list-entitlement.component';
import { UpsertEntitlementComponent } from './pages/upsert-entitlement/upsert-entitlement.component';
import { AdminEntitlementService } from './services/admin-entitlement.service';

export const adminEntitlementRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    /*TODO need fix*/
    data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
    children: [
      { path: '', component: ListEntitlementComponent },
      // { path: 'period', component: ListEntitlementComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminEntitlementRoutes),
    FormlyModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiInputMonthModule,
    TuiTagModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    FormlyUserComboBoxComponentModule,
    TuiLetModule,
    SelectOptionsModule,
    TuiLoaderModule,
    TableModule,
    TranslocoModule,
    TuiTabsModule,
    PolymorpheusModule,
  ],
  declarations: [ListEntitlementComponent, UpsertEntitlementComponent],
  providers: [AdminEntitlementService],
})
export class AdminEntitlementModule {}
