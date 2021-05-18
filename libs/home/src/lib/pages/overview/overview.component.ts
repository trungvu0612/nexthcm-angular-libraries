import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  fingerCheck: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  fingerStatus() {
    this.fingerCheck  = !this.fingerCheck;
  }
}
