import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
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
import { TuiBadgedContentModule, TuiRadioLabeledModule, TuiTabsModule, TuiToggleModule } from '@taiga-ui/kit';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';

import { AvatarComponentModule, BaseFormComponentModule } from '../../components';
import { HeaderComponent } from './header/header.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { LayoutComponent } from './layout.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PageComponent } from './page/page.component';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, PageComponent, NotificationsComponent, NotificationItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    AvatarComponentModule,
    TranslocoModule,
    NgxPermissionsModule,
    TuiTabsModule,
    TuiDataListModule,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiScrollbarModule,
    PushModule,
    TuiBadgedContentModule,
    TuiDropdownControllerModule,
    TuiToggleModule,
    ReactiveFormsModule,
    TuiActiveZoneModule,
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: TimeagoIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
    TuiLoaderModule,
    TuiDialogModule,
    BaseFormComponentModule,
    TuiRadioLabeledModule,
  ],
  exports: [LayoutComponent, PageComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'layout', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class LayoutModule {}
