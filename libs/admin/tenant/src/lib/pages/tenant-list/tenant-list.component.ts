import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TenantData } from '../../models/tenant';

@Component({
  selector: 'hcm-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantListComponent implements OnInit {
  data: Partial<TenantData>[] = [
    {
      id: '123131',
      code: 'HHASS',
      company: 'Banvien',
      email: 'nguyenvana@banvien.com.vn',
      fullName: 'Nguyễn Văn A',
      phone: '090911231',
      status: 'Hoạt động',
    },
    {
      id: '5555222',
      code: 'RGWSW',
      company: 'Banvien',
      email: 'nguyenvanb@banvien.com.vn',
      fullName: 'Nguyễn Văn B',
      phone: '090911231',
      status: 'Chờ duyệt',
    },
  ];
  columns = ['id', 'code', 'company', 'email', 'fullName', 'phone', 'status', 'action'];

  constructor() {}

  ngOnInit(): void {}
}
