import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JoinByKeyPipeModule } from '@nexthcm/cdk';
import { FormlyQuartzCronComponentModule } from '@nexthcm/crontab/formly';
import {
  BaseFormComponentModule,
  FormlyQuillTemplateVariablesComponentModule,
  FormlyStatusToggleComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MultiSelectFilterComponentModule,
  SelectFilterComponentModule,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { NotificationManagementComponent } from './pages/notification-management/notification-management.component';
import { UpsertNotificationComponent } from './pages/upsert-notification/upsert-notification.component';
import { AdminNotificationsService } from './services/admin-notifications.service';

export const adminNotificationsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_NOTIFICATION', redirectTo: '/' } },
    children: [
      { path: '', component: NotificationManagementComponent },
      {
        path: 'add',
        component: UpsertNotificationComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_NOTIFICATION', redirectTo: '/' } },
      },
      {
        path: ':notificationId/edit',
        component: UpsertNotificationComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_NOTIFICATION', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminNotificationsRoutes),
    TranslocoModule,
    LayoutModule,
    TuiLoaderModule,
    BaseFormComponentModule,
    PushModule,
    ReactiveFormsModule,
    FormlyStatusToggleComponentModule,
    FormlyQuillTemplateVariablesComponentModule,
    InputFilterComponentModule,
    TuiButtonModule,
    TuiTagModule,
    TuiPrimitiveCheckboxModule,
    JoinByKeyPipeModule,
    SelectFilterComponentModule,
    TuiLetModule,
    TuiDataListModule,
    MultiSelectFilterComponentModule,
    TableModule,
    TuiTablePaginationModule,
    TuiMarkerIconModule,
    FormlyQuartzCronComponentModule,
    NgxPermissionsModule,
  ],
  declarations: [NotificationManagementComponent, UpsertNotificationComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'notifications', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
    AdminNotificationsService,
  ],
})
export class AdminNotificationsModule {}
