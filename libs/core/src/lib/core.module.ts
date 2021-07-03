import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TUI_TABLE_PAGINATION_TEXTS } from '@taiga-ui/addon-table';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TUI_SPIN_TEXTS, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { NgxPermissionsModule } from 'ngx-permissions';
import { APP_CONFIG } from './app-config.token';
import { registerTranslateExtension } from './extensions/formly-register-translate-extension';
import { GraphqlModule } from './graphql/graphql.module';
import { apiPrefixInterceptorProvider } from './interceptors';
import { AppConfig } from './models';
import { httpLoader } from './transloco/http-loader';
import { translocoConfigProvider } from './transloco/transloco-config';
import { translateSpinTexts, translateTuiTablePaginationTexts } from './utils/translate-tui-texts';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    TuiDialogModule,
    SweetAlert2Module.forRoot(),
    GraphqlModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    httpLoader,
    translocoConfigProvider,
    apiPrefixInterceptorProvider,
    { provide: TUI_ICONS_PATH, useValue: iconsPathFactory('assets/taiga-ui/icons/') },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: FORMLY_CONFIG, multi: true, useFactory: registerTranslateExtension, deps: [TranslocoService] },
    { provide: TUI_TABLE_PAGINATION_TEXTS, useFactory: translateTuiTablePaginationTexts, deps: [TranslocoService] },
    { provide: TUI_SPIN_TEXTS, useFactory: translateSpinTexts, deps: [TranslocoService] },
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
