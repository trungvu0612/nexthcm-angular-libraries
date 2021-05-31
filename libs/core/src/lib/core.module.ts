import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { iconsPathFactory, TUI_ICONS_PATH, TUI_SANITIZER, TuiDialogModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { CookieModule } from 'ngx-cookie';
import { ENVIRONMENT } from './core.config';
import { Environment } from './models';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    FormlyModule.forRoot({ extras: { resetFieldOnHide: true } }),
    CookieModule.forRoot(),
    HttpClientModule,
    TuiDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
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

  static forRoot(environment: Environment): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [{ provide: ENVIRONMENT, useValue: environment }],
    };
  }
}
