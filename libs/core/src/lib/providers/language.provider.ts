import { Provider } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Language, TUI_ENGLISH_LANGUAGE, TUI_LANGUAGE, TUI_VIETNAMESE_LANGUAGE } from '@taiga-ui/i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const LANGUAGE_PROVIDER: Provider = {
  provide: TUI_LANGUAGE,
  useFactory(translate: TranslocoService): Observable<Language> {
    return translate.langChanges$.pipe(map((lang) => (lang === 'vi' ? TUI_VIETNAMESE_LANGUAGE : TUI_ENGLISH_LANGUAGE)));
  },
  deps: [TranslocoService],
};
