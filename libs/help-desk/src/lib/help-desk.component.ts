import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-help-desk',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDeskComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.set({
      root: '/help-desk',
      tabs: [
        { path: '/seat-map', tabName: 'seatMap' },
        { path: '/bv-calendar', tabName: 'bvCalendar' },
      ],
    });
  }
}
