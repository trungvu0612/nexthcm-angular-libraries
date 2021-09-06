import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-list-leave-entitlement',
  templateUrl: './list-leave-entitlement.component.html',
  styleUrls: ['./list-leave-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeaveEntitlementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
