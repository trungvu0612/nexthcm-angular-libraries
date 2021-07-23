import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-my-leave',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLeaveComponent {}
