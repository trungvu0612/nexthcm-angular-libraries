import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-notification-setting-dialog',
  templateUrl: './notification-setting-dialog.component.html',
  styleUrls: ['./notification-setting-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettingDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
