import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-create-leave-request-dialog',
  templateUrl: './create-leave-request-dialog.component.html',
  styleUrls: ['./create-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeaveRequestDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
