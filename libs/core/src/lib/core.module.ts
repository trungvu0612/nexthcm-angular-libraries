import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { CookieModule } from 'ngx-cookie';
import { APP_CONFIG } from './app-config.token';
import { apiPrefixInterceptorProvider } from './interceptors';
import { AppConfig } from './models';
import { httpLoader } from './transloco/http-loader';
import { translocoConfigProvider } from './transloco/transloco-config';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    CookieModule.forRoot(),
    TuiDialogModule,
  ],
  providers: [
    httpLoader,
    translocoConfigProvider,
    apiPrefixInterceptorProvider,
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
