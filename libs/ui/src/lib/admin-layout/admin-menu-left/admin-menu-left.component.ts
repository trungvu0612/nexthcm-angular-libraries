import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
export interface Menu {
  name: string;
  uri: string;
}

@Component({
  selector: 'hcm-admin-menu-left',
  templateUrl: './admin-menu-left.component.html',
  styleUrls: ['./admin-menu-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdminMenuLeftComponent implements OnInit {
  readonly policyMenu: Menu[] = [
    {
      name: 'Danh sách chính sách',
      uri: '/admin/employees',
    },
    {
      name: 'Thêm chính sách',
      uri: '/admin/employees/add',
    }
  ];
  constructor() {}

  ngOnInit(): void {}
}
