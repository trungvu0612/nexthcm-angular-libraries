import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseFormComponentModule,
  FormlyStatusToggleComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  LeafletMapModule,
  MenuItem,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule, TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { UpsertOfficeDialogComponent } from './components/upsert-office-dialog/upsert-office-dialog.component';
import { UpsertWifiDeviceComponent } from './components/upsert-wifi-device/upsert-wifi-device.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { OfficeManagementComponent } from './pages/office-management/office-management.component';
import { OfficeNetworkDevicesComponent } from './pages/office-network-devices/office-network-devices.component';
import { WifiDeviceManagement } from './pages/wifi-device-management/wifi-device-management.component';
import { AdminOfficesService } from './services/admin-offices.service';

export const adminOfficesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OFFICE', redirectTo: '/' } },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OfficeManagementComponent },
      {
        path: 'network',
        children: [
          { path: '', component: WifiDeviceManagement },
          { path: ':officeId', component: OfficeNetworkDevicesComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    OfficeManagementComponent,
    UpsertOfficeDialogComponent,
    UpsertWifiDeviceComponent,
    OfficeNetworkDevicesComponent,
    WifiDeviceManagement,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminOfficesRoutes),
    TranslocoModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TableModule,
    TuiLetModule,
    InputFilterComponentModule,
    TuiLoaderModule,
    LayoutModule,
    NgxPermissionsModule,
    BaseFormComponentModule,
    TuiPrimitiveCheckboxModule,
    LeafletMapModule,
    TuiTagModule,
    FormlyStatusToggleComponentModule,
    PushModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
  ],
  providers: [
    AdminOfficesService,
    {
      provide: HEADER_TABS,
      useValue: [
        { title: 'office', route: '/admin/offices/list', permissions: [] },
        { title: 'offices.network', route: '/admin/offices/network', permissions: [] },
      ] as MenuItem[],
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'offices', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminOfficesModule {}
