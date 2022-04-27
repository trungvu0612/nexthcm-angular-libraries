import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormlyModule } from '@ngx-formly/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TuiAlertModule, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FileSaverModule } from 'ngx-filesaver';
import { NgxPermissionsModule } from 'ngx-permissions';
import { QuicklinkModule } from 'ngx-quicklink';

import { APP_CONFIG } from './app-config.token';
import { API_PREFIX_INTERCEPTOR_PROVIDER, BLOB_ERROR_HTTP_INTERCEPTOR_PROVIDER } from './interceptors';
import { AppConfig } from './models';
import { FORMLY_CONFIG_TRANSLATION_PROVIDER } from './providers/formly-config-translation.provider';
import { INIT_PERMISSIONS_PROVIDER } from './providers/init-permissions.provider';
import { LANGUAGE_PROVIDER } from './providers/language.provider';
import { TranslocoRootModule } from './transloco/transloco-root.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoRootModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    TuiAlertModule,
    TuiDialogModule,
    SweetAlert2Module.forRoot(),
    NgxPermissionsModule.forRoot(),
    SvgIconsModule.forRoot({ defaultSize: 'lg' }),
    QuicklinkModule,
    FileSaverModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    API_PREFIX_INTERCEPTOR_PROVIDER,
    BLOB_ERROR_HTTP_INTERCEPTOR_PROVIDER,
    FORMLY_CONFIG_TRANSLATION_PROVIDER,
    INIT_PERMISSIONS_PROVIDER,
    LANGUAGE_PROVIDER,
    { provide: TUI_ICONS_PATH, useValue: iconsPathFactory('assets/taiga-ui/icons/') },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
    if (coreModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }

  static forRoot(environment: AppConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    };
  }
}
