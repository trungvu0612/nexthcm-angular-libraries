import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-my-time',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTimeComponent {
  constructor(headerService: HeaderService) {
    headerService.set({
      root: '/my-time',
      tabs: [
        { path: '/my-leave', tabName: 'myLeave' },
        { path: '/working-hour', tabName: 'workingHour' },
        { path: '/my-request', tabName: 'myRequest' },
        { path: '/request-management', tabName: 'requestManagement' },
      ],
    });
  }
}
