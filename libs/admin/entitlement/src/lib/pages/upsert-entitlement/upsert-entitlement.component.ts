import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-upsert-entitlement',
  templateUrl: './upsert-entitlement.component.html',
  styleUrls: ['./upsert-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEntitlementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
