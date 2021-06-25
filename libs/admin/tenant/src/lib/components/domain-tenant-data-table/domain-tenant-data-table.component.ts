import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomainTenantData } from '../../models/tenant';

@Component({
  selector: 'hcm-domain-tenant-data-table',
  templateUrl: './domain-tenant-data-table.component.html',
  styleUrls: ['./domain-tenant-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainTenantDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<DomainTenantData>[];
  constructor() {}

  ngOnInit(): void {}
}
