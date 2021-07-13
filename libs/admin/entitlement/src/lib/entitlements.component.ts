import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-entitlements',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitlementsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
