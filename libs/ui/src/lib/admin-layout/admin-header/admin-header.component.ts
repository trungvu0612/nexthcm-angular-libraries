import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent implements OnInit {
  items = [
    {
      caption: 'Trang chủ',
      routerLink: '/',
    },
    {
      caption: 'Quản lý phòng ban',
      routerLink: '/',
      routerLinkActiveOptions: { exact: true },
    },
  ];
  notification = 2;

  constructor(private router: Router, private translocoService: TranslocoService, private authService: AuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}
