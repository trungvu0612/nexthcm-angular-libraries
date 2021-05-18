import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuLeftComponent implements OnInit {
  readonly myTimes = ['Leave History', 'Request Update Time', 'Request Working Outside', 'Working Hour'];

  constructor() { }

  ngOnInit(): void {
  }

}
