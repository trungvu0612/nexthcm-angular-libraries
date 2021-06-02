import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { MyRequestQuery } from './my-request.query';

export const MY_REQUEST_PAGINATOR = new InjectionToken('MY_REQUEST_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const myRequestQuery = inject(MyRequestQuery);
    return new PaginatorPlugin(myRequestQuery);
  },
});
