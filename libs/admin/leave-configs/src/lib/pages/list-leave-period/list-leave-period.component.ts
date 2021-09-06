import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-list-leave-period',
  templateUrl: './list-leave-period.component.html',
  styleUrls: ['./list-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListLeavePeriodComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
