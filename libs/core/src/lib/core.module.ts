import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { akitaConfig, enableAkitaProdMode } from '@datorama/akita';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormlyModule } from '@ngx-formly/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  iconsPathFactory,
  TUI_ICONS_PATH,
  TUI_SANITIZER,
  TuiDialogModule,
  TuiNotificationsModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { NgxPermissionsModule } from 'ngx-permissions';
import { QuicklinkModule } from 'ngx-quicklink';
import { APP_CONFIG } from './app-config.token';
import { API_PREFIX_INTERCEPTOR_PROVIDER } from './interceptors';
import { AppConfig } from './models';
import { FORMLY_CONFIG_TRANSLATION_PROVIDER } from './providers/formly-config-translation.provider';
import { INIT_PERMISSIONS_PROVIDER } from './providers/init-permissions.provider';
import { LANGUAGE_PROVIDER } from './providers/language.provider';
import { TranslocoRootModule } from './transloco/transloco-root.module';

registerLocaleData(localeVi);
akitaConfig({ resettable: true });

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoRootModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    TuiDialogModule,
    TuiNotificationsModule,
    SweetAlert2Module.forRoot(),
    NgxPermissionsModule.forRoot(),
    SvgIconsModule.forRoot({ defaultSize: 'lg' }),
    AkitaNgRouterStoreModule,
    QuicklinkModule,
    TuiNotificationsModule,
  ],
  providers: [
    API_PREFIX_INTERCEPTOR_PROVIDER,
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
    if (environment.production) {
      enableAkitaProdMode();
    }
    return {
      ngModule: CoreModule,
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    };
  }
}
