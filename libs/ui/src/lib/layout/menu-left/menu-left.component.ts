import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

export interface Menu {
  name: string;
  uri: string;
}

@Component({
  selector: 'hcm-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLeftComponent implements OnInit {
  readonly myTimeMenus: Menu[] = [
    {
      name: 'Leave History',
      uri: '',
    },
    {
      name: 'Request Update Time',
      uri: '',
    },
    {
      name: 'Request Working Outside',
      uri: '',
    },
    {
      name: 'My Request',
      uri: '/my-time/my-request',
    },
    {
      name: 'Working Hour',
      uri: '/my-time/working-hour',
    },
  ];

  readonly adminMenus: Menu[] = [
    {
      name: 'Quản lý công ty',
      uri: '/admin/tenant',
    },
    {
      name: 'Quản lý nhân viên',
      uri: '/admin/employees',
    },
    {
      name: 'Quản lý vai trò',
      uri: '/admin/user-roles',
    },
    {
      name: 'Quản lý quyền',
      uri: '/admin/permissions',
    },
    {
      name: 'Quản lý văn phòng',
      uri: '/admin/offices',
    },
    {
      name: 'Quản lý sơ đồ chỗ ngồi',
      uri: '/admin/offices/seat-maps',
    },
    {
      name: 'Quản lý chính sách',
      uri: '/admin/policies',
    },
    {
      name: 'Quản lý cấp bậc',
      uri: '/admin/job-level',
    },
    {
      name: 'Quản lý quy trình',
      uri: '/admin/processes',
    },
    {
      name: 'Quản lý chi nhánh',
      uri: '/admin/branches',
    },
    {
      name: 'Quản lý căn hộ',
      uri: '/admin/departments',
    },
    {
      name: 'Quản lý chức vụ',
      uri: '/admin/job-titles',
    },
    {
      name: 'Phụ cấp',
      uri: '/admin/entitlements',
    },
    {
      name: 'Quản lý loại ngày nghỉ',
      uri: '/admin/leave-types',
    },
    {
      name: 'Quản lý loại ngày nghỉ',
      uri: '/admin/leave-types',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
