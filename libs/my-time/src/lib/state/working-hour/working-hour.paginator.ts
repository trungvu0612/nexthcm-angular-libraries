import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { WorkingHourQuery } from './working-hour.query';

export const WORKING_HOUR_PAGINATOR = new InjectionToken('WORKING_HOUR_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const workingHourQuery = inject(WorkingHourQuery);
    return new PaginatorPlugin(workingHourQuery);
  },
});
