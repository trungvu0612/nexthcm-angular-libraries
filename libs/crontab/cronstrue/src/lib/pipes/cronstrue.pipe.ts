import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import cronValidator from 'cron-expression-validator';
import { map, Observable, of } from 'rxjs';

import cronstrue from '../utils/cronstrue-i18n';

@Pipe({
  name: 'cronstrue',
})
export class CronstruePipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  transform(value: string): Observable<string> {
    return cronValidator.isValidCronExpression(value)
      ? this.translocoService.langChanges$.pipe(
          map((locale) => cronstrue.toString(value, { locale, dayOfWeekStartIndexZero: false }))
        )
      : of('');
  }
}
