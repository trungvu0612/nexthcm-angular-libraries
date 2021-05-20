import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { LeaveTypeQuery } from './leave-type.query';

export const LEAVE_TYPE_PAGINATOR = new InjectionToken('LEAVE_TYPE_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const leaveTypeQuery = inject(LeaveTypeQuery);
    return new PaginatorPlugin(leaveTypeQuery);
  },
});
