import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeVi from '@angular/common/locales/vi';
import { NgModule } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TRANSLATION_CONFIG_PROVIDER } from './transloco-config';
import { TRANSLOCO_HTTP_LOADER_PROVIDER } from './transloco-http-loader';

@NgModule({
  imports: [TranslocoLocaleModule.forRoot({ langToLocaleMapping: { en: 'en-US', vi: 'vi-VN' } })],
  exports: [TranslocoModule],
  providers: [TRANSLOCO_HTTP_LOADER_PROVIDER, TRANSLATION_CONFIG_PROVIDER],
})
export class TranslocoRootModule {
  constructor(translocoService: TranslocoService) {
    translocoService.langChanges$.subscribe((lang) =>
      lang === 'vi' ? registerLocaleData(localeVi) : registerLocaleData(localeEn)
    );
  }
}
