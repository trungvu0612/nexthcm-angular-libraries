import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-upsert-leave-period',
  templateUrl: './upsert-leave-period.component.html',
  styleUrls: ['./upsert-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeavePeriodComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
