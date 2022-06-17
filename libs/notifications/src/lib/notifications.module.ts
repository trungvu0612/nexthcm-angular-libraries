import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiActiveZoneModule, TuiMapperPipeModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { NotificationSettingsComponent } from './pages/notification-settings/notification-settings.component';

export const notificationsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: { permissions: { only: 'VIEW_SETTING_NOTIFICATIONS', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'settings' },
      {
        path: 'settings',
        component: NotificationSettingsComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [NotificationSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(notificationsRoutes),
    RouterModule,
    TranslocoModule,
    TuiDataListModule,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiScrollbarModule,
    PushModule,
    TuiDropdownControllerModule,
    ReactiveFormsModule,
    TuiActiveZoneModule,
    TuiMapperPipeModule,
    TuiLoaderModule,
    TuiDialogModule,
    BaseFormComponentModule,
    LayoutModule,
    TuiMarkerIconModule,
    TuiCheckboxModule,
    TuiTagModule,
  ],
})
export class NotificationsModule {}
