import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { FormlyModule } from '@ngx-formly/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { NgxPermissionsModule } from 'ngx-permissions';
import { APP_CONFIG } from './app-config.token';
import { GraphqlModule } from './graphql/graphql.module';
import { API_PREFIX_INTERCEPTOR_PROVIDER } from './interceptors';
import { AppConfig } from './models';
import { FORMLY_CONFIG_TRANSLATION_PROVIDER } from './providers/formly-config-translation.provider';
import { INIT_PERMISSIONS_PROVIDER } from './providers/init-permissions.provider';
import { LANGUAGE_PROVIDER } from './providers/language.provider';
import { TRANSLATION_CONFIG_PROVIDER } from './transloco/transloco-config';
import { TRANSLOCO_HTTP_LOADER_PROVIDER } from './transloco/transloco-http-loader';
import { TranslocoRootModule } from './transloco/transloco-root.module';

registerLocaleData(localeVi);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoRootModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    TuiDialogModule,
    SweetAlert2Module.forRoot(),
    GraphqlModule,
    NgxPermissionsModule.forRoot(),
    SvgIconsModule.forRoot({ defaultSize: 'lg' }),
  ],
  providers: [
    TRANSLOCO_HTTP_LOADER_PROVIDER,
    TRANSLATION_CONFIG_PROVIDER,
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
    return {
      ngModule: CoreModule,
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    };
  }
}
