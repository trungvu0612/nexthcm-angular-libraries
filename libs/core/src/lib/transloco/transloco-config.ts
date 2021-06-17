import { Injector, Provider } from '@angular/core';
import { TRANSLOCO_CONFIG, translocoConfig } from '@ngneat/transloco';
import { APP_CONFIG } from '../app-config.token';

export const translocoConfigFactory = (injector: Injector) => {
  const appConfig = injector.get(APP_CONFIG);
  return translocoConfig({
    availableLangs: ['en', 'vi'],
    defaultLang: appConfig.language,
    fallbackLang: appConfig.language,
    prodMode: appConfig.production,
    reRenderOnLangChange: true,
  });
};

export const translocoConfigProvider: Provider = {
  provide: TRANSLOCO_CONFIG,
  useFactory: translocoConfigFactory,
  deps: [Injector],
};