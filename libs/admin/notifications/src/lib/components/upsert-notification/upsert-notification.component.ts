import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-upsert-notification',
  templateUrl: './upsert-notification.component.html',
  styleUrls: ['./upsert-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertNotificationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
