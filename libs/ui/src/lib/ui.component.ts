import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hcm-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
