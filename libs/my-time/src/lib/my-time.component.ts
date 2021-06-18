import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-my-time',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTimeComponent {}
