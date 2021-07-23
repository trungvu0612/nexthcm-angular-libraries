import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-noted',
  templateUrl: './noted.component.html',
  styleUrls: ['./noted.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
