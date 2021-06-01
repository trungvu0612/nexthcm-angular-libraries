import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { LevelQuery } from './level.query';

export const LEVEL_PAGINATOR = new InjectionToken('LEVEL_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const levelQuery = inject(LevelQuery);
    return new PaginatorPlugin(levelQuery);
  },
});
