import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-history-request',
  templateUrl: './history-request.component.html',
  styleUrls: ['./history-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryRequestComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
