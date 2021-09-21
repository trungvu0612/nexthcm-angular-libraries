import { Translation } from '@ngneat/transloco';
import { AVAILABLE_LANGS } from './availabel-langs.const';

export function inlineLoaderFactory(loader: (lang: string) => Promise<Translation>) {
  return AVAILABLE_LANGS.reduce((acc: Translation, lang) => {
    acc[lang] = () => loader(lang);
    return acc;
  }, {});
}
