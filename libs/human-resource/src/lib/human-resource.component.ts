import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-human-resource',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HumanResourceComponent {}
