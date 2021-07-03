import { TranslocoService } from '@ngneat/transloco';
import { LanguageTable } from '@taiga-ui/i18n';
import { Observable } from 'rxjs';

export function translateTuiTablePaginationTexts(translate: TranslocoService): Observable<LanguageTable> {
  return translate.selectTranslateObject<LanguageTable>('TUI_TABLE_PAGINATION_TEXTS');
}

export function translateSpinTexts(translate: TranslocoService): Observable<[string, string]> {
  return translate.selectTranslate('TUI_SPIN_TEXTS');
}
