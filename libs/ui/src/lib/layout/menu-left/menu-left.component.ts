import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

export interface Menu {
  name: string;
  uri: string;
}

@Component({
  selector: 'hcm-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuLeftComponent implements OnInit {
  readonly myTimeMenus: Menu[] = [
    {
      name: 'Leave History',
      uri: ''
    },
    {
      name: 'Request Update Time',
      uri: ''
    },
    {
      name: 'Request Working Outside',
      uri: ''
    },
    {
      name: 'Working Hour',
      uri: '/my-time/working-hour'
    }
  ];

  readonly adminMenus: Menu[] = [
    {
      name: 'Job Level',
      uri: '/human-resource/job-level'
    },
    {
      name: 'Leave Types',
      uri: '/my-time/leave-type'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
