import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-upsert-leave-entitlement',
  templateUrl: './upsert-leave-entitlement.component.html',
  styleUrls: ['./upsert-leave-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveEntitlementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
