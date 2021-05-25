import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { TranslocoService } from '@ngneat/transloco';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';

const PATHS: { [key: string]: string[] } = {
  'help-desk': ['seat-map', 'bv-calendar'],
  'human-resource': ['chart', 'teams', 'employees'],
  'my-time': ['leave', 'working-hour', 'request'],
  policy: ['policies', 'updated'],
};

const LANGS: { [key: string]: string } = {
  en: 'English',
  vi: 'Tiếng Việt',
};

@Component({
  selector: 'hcm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;
  open = false;
  langs = (this.translocoService.getAvailableLangs() as string[]).map((lang) => LANGS[lang]);
  urlSegments = this.router.url.split('/');
  activeItemIndex!: number;
  tabs!: string[];
  notification = 13;

  constructor(private router: Router, private translocoService: TranslocoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.tabs = PATHS[this.urlSegments[1]];
    this.activeItemIndex = PATHS[this.urlSegments[1]].indexOf(this.urlSegments[2]);
  }

  changeTab(index: number): void {
    this.urlSegments[2] = PATHS[this.urlSegments[1]][index];
    this.router.navigate(this.urlSegments.slice(0, 3));
  }

  changeLang(lang: string) {
    this.open = false;
    if (this.component && this.component.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }
    this.translocoService.setActiveLang(Object.keys(LANGS).find((key) => LANGS[key] == lang) as string);
  }

  logout(): void {
    this.authService.logout();
  }
}
