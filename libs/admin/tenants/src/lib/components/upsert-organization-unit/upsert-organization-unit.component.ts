import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-upsert-organization-unit',
  templateUrl: './upsert-organization-unit.component.html',
  styleUrls: ['./upsert-organization-unit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertOrganizationUnitComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
