import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-leave-type',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveTypesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}