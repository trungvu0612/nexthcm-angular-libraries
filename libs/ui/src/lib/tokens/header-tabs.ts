import { InjectionToken } from '@angular/core';
import { MenuItem } from '../models';

export const HEADER_TABS = new InjectionToken<readonly MenuItem[]>('Array of header tabs', {
  factory: () => [],
});
