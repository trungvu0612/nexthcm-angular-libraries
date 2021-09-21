import { Injector, Provider } from '@angular/core';
import { TRANSLOCO_CONFIG, translocoConfig } from '@ngneat/transloco';
import { APP_CONFIG } from '../app-config.token';
import { AVAILABLE_LANGS } from './availabel-langs.const';

const translocoConfigFactory = (injector: Injector) => {
  const appConfig = injector.get(APP_CONFIG);
  return translocoConfig({
    availableLangs: AVAILABLE_LANGS,
    defaultLang: localStorage.getItem('lang') || appConfig.language,
    fallbackLang: appConfig.language,
    prodMode: appConfig.production,
    reRenderOnLangChange: true,
    flatten: { aot: appConfig.production },
  });
};

export const TRANSLATION_CONFIG_PROVIDER: Provider = {
  provide: TRANSLOCO_CONFIG,
  useFactory: translocoConfigFactory,
  deps: [Injector],
};
