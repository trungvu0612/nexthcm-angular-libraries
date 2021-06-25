import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { TranslocoService } from '@ngneat/transloco';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';

const LANGS: { [key: string]: string } = {
  en: 'English',
  vi: 'Tiếng Việt',
};

@Component({
  selector: 'hcm-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent implements OnInit {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;
  open = false;
  langs = (this.translocoService.getAvailableLangs() as string[]).map((lang) => LANGS[lang]);
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

  changeLang(lang: string) {
    this.open = false;
    if (this.component && this.component.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }
    this.translocoService.setActiveLang(Object.keys(LANGS).find((key) => LANGS[key] == lang) as string);
  }
}
