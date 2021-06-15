import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-update-permission',
  templateUrl: './update-permission.component.html',
  styleUrls: ['./update-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePermissionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
