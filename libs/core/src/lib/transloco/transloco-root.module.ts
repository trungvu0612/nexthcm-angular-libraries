import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TRANSLATION_CONFIG_PROVIDER } from './transloco-config';
import { TRANSLOCO_HTTP_LOADER_PROVIDER } from './transloco-http-loader';

@NgModule({
  imports: [TranslocoLocaleModule.init({ langToLocaleMapping: { en: 'en-US', vi: 'vi-VN' } })],
  exports: [TranslocoModule],
  providers: [TRANSLOCO_HTTP_LOADER_PROVIDER, TRANSLATION_CONFIG_PROVIDER],
})
export class TranslocoRootModule {}
