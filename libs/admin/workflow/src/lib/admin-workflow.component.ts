import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-admin-workflow',
  template: '<router-outlet></router-outlet>',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminWorkflowComponent {}