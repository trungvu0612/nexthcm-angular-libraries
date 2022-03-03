import * as allLocales from './all-locales';
import { Locale } from './locale';

export class allLocalesLoader {
  load(availableLocales: { [name: string]: Locale }) {
    for (const property in allLocales) {
      availableLocales[property] = new (allLocales as any)[property]() as Locale;
    }
  }
}
