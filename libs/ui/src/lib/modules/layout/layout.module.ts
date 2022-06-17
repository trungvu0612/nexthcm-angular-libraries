import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { TuiHintModule, TuiTooltipModule } from '@taiga-ui/core';
import {
  TuiBadgedContentModule,
  TuiCheckboxModule,
  TuiRadioLabeledModule,
  TuiTabsModule,
  TuiToggleModule,
} from '@taiga-ui/kit';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';

import { AvatarComponentModule, BaseFormComponentModule } from '../../components';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { NotificationItemComponent } from './notifications/components/notification-item/notification-item.component';
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
    TuiMapperPipeModule,
    TuiCheckboxModule,
    TuiTooltipModule,
    TuiHintModule,
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
})
export class LayoutModule {}
