import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {TenantData} from "../../models/tenant";

@Component({
  selector: 'hcm-tenant-data-table',
  templateUrl: './tenant-data-table.component.html',
  styleUrls: ['./tenant-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<TenantData>[];
  constructor() { }

  ngOnInit(): void {
  }

}
