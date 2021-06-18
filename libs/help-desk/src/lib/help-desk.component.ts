import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-help-desk',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDeskComponent {}
