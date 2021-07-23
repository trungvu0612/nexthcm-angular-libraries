import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TUI_TABLE_PAGINATION_TEXTS } from '@taiga-ui/addon-table';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TUI_SPIN_TEXTS, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { APP_CONFIG } from './app-config.token';
import { TranslateExtension } from './extensions/formly-translate-extension';
import { GraphqlModule } from './graphql/graphql.module';
import { apiPrefixInterceptorProvider } from './interceptors';
import { AppConfig } from './models';
import { PermissionsResponse } from './models/permission-response';
import { PermissionsService } from './services/permissions.service';
import { httpLoader } from './transloco/http-loader';
import { translocoConfigProvider } from './transloco/transloco-config';
import { translateSpinTexts, translateTuiTablePaginationTexts } from './utils/translate-tui-texts';

function initApp(permissionsService: PermissionsService): () => Observable<PermissionsResponse> {
  return () => permissionsService.getPermissions();
}

const configFormly = (translate: TranslocoService) => ({
  extensions: [{ name: 'translate', extension: new TranslateExtension(translate) }],
  validationMessages: [
    { name: 'required', message: () => translate.selectTranslate('VALIDATION.required') },
    { name: 'email', message: () => translate.selectTranslate('VALIDATION.email') },
    { name: 'numeric', message: () => translate.selectTranslate('VALIDATION.numeric') },
  ],
});

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
    SvgIconsModule.forRoot({ defaultSize: 'lg' }),
  ],
  providers: [
    httpLoader,
    translocoConfigProvider,
    apiPrefixInterceptorProvider,
    { provide: TUI_ICONS_PATH, useValue: iconsPathFactory('assets/taiga-ui/icons/') },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: FORMLY_CONFIG, multi: true, useFactory: configFormly, deps: [TranslocoService] },
    { provide: TUI_TABLE_PAGINATION_TEXTS, useFactory: translateTuiTablePaginationTexts, deps: [TranslocoService] },
    { provide: TUI_SPIN_TEXTS, useFactory: translateSpinTexts, deps: [TranslocoService] },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [PermissionsService],
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() coreModule: CoreModule,
    translocoService: TranslocoService,
    formlyConfig: FormlyConfig
  ) {
    if (coreModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
    formlyConfig.addValidatorMessage('required', () => translocoService.selectTranslate('VALIDATION.required'));
    formlyConfig.addValidatorMessage('email', () => translocoService.selectTranslate('VALIDATION.email'));
    formlyConfig.addValidatorMessage('numeric', () => translocoService.selectTranslate('VALIDATION.numeric'));
  }

  static forRoot(environment: AppConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    };
  }
}
