import { InjectionToken } from '@angular/core';

import { MenuItem } from '../models';

export const HEADER_TABS = new InjectionToken<MenuItem[]>('Array of header tabs', {
  factory: () => [],
  providedIn: 'root',
});
