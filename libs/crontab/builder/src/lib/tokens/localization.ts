import { InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';

import { VI_LOCALIZATION } from '../constants/localizations';
import { CronLocalization } from '../models';

export const CRON_LOCALIZATION = new InjectionToken<Observable<CronLocalization>>('Cron Localization', {
  factory: () => of(VI_LOCALIZATION),
});
