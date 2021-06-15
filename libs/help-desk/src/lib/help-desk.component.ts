import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-help-desk',
  template: ` <hcm-header></hcm-header>
    <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDeskComponent {}
