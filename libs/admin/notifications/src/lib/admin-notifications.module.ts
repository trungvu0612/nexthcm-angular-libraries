import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { JoinByKeyPipeModule, RolesEffects } from '@nexthcm/cdk';
import { CronBuilderModule } from '@nexthcm/cron-builder';
import {
  BaseFormComponentModule,
  FormlyQuillTemplateVariablesComponentModule,
  FormlyStatusToggleComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  PaginationTableComponentModule,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiButtonModule, TuiLoaderModule, TuiPrimitiveCheckboxModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';

import { FormlyQuartzCronComponent } from './components/formly-quartz-cron/formly-quartz-cron.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { NotificationManagementComponent } from './pages/notification-management/notification-management.component';
import { UpsertNotificationComponent } from './pages/upsert-notification/upsert-notification.component';
import {
  NotificationEmailVariablesEffects,
  NotificationEmailVariablesQuery,
  NotificationEmailVariablesStore,
} from './store/notification-email-variables';

export const adminNotificationsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: { permissions: { only: 'VIEW_NOTIFICATION', redirectTo: '/' } },
    children: [
      { path: '', component: NotificationManagementComponent },
      { path: 'add', component: UpsertNotificationComponent },
      { path: ':notificationId/edit', component: UpsertNotificationComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminNotificationsRoutes),
    AkitaNgEffectsModule.forFeature([NotificationEmailVariablesEffects, RolesEffects]),
    TranslocoModule,
    LayoutModule,
    TuiLoaderModule,
    BaseFormComponentModule,
    PushModule,
    CronBuilderModule,
    FormlyModule.forChild({ types: [{ name: 'quartz-cron', component: FormlyQuartzCronComponent }] }),
    ReactiveFormsModule,
    FormlyStatusToggleComponentModule,
    FormlyQuillTemplateVariablesComponentModule,
    PaginationTableComponentModule,
    InputFilterComponentModule,
    TuiButtonModule,
    TuiTagModule,
    TuiPrimitiveCheckboxModule,
    TuiSvgModule,
    JoinByKeyPipeModule,
  ],
  declarations: [NotificationManagementComponent, UpsertNotificationComponent, FormlyQuartzCronComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'notifications', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
    NotificationEmailVariablesStore,
    NotificationEmailVariablesQuery,
  ],
})
export class AdminNotificationsModule {}
