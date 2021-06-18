import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { TranslocoService } from '@ngneat/transloco';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

const PATHS: { [key: string]: string[] } = {
  'help-desk': ['seatMap', 'bvCalendar'],
  'human-resource': ['organizationChart', 'teams', 'employees'],
  'my-time': ['myLeave', 'workingHour', 'myRequest'],
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
  urlSegments$ = new BehaviorSubject<string[]>([]);
  tabs$ = this.urlSegments$.pipe(map((urls) => PATHS[urls[1]]));
  activeItemIndex$ = this.urlSegments$.pipe(
    map((urls) => PATHS[urls[1]]?.map((item) => item.replace(/[A-Z]/, (m) => '-' + m.toLowerCase())).indexOf(urls[2]))
  );
  notification = 13;

  constructor(private router: Router, private translocoService: TranslocoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e: any) => e instanceof NavigationEnd),
        map((event: NavigationEnd) => event.urlAfterRedirects),
        startWith(this.router.url),
        map((url) => url.split('/'))
      )
      .subscribe(this.urlSegments$);
  }

  changeTab(index: number): void {
    this.urlSegments$.value[2] = PATHS[this.urlSegments$.value[1]][index].replace(
      /[A-Z]/,
      (m) => '-' + m.toLowerCase()
    );
    this.router.navigate(this.urlSegments$.value.slice(0, 3));
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
