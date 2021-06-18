import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertTenantComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
