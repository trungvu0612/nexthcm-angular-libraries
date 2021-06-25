import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Tenant } from '../../models/tenant';

@Component({
  selector: 'hcm-tenant-data-table',
  templateUrl: './tenant-data-table.component.html',
  styleUrls: ['./tenant-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<Tenant>[];
  constructor() {}

  ngOnInit(): void {}
}
