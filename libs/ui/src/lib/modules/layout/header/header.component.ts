import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderService } from '../../../services';

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
export class HeaderComponent {
  open = false;
  notification = 13;
  readonly languages = (this.translocoService.getAvailableLangs() as string[]).map((lang) => LANGS[lang]);
  readonly index$ = new BehaviorSubject(0);
  readonly tabs$ = this.headerService.select();

  constructor(
    private readonly headerService: HeaderService,
    private readonly translocoService: TranslocoService,
    private readonly router: Router
  ) {
    this.headerService.hold(
      this.router.events.pipe(filter((e: any) => e instanceof NavigationEnd)),
      (event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        const headerTab = this.headerService.get();
        if (new RegExp('^' + headerTab.root).test(url)) {
          for (let index = headerTab.tabs.length - 1; index >= 0; index--) {
            if (url.includes(headerTab.root + headerTab.tabs[index].path)) {
              this.index$.next(index);
              break;
            }
          }
        } else this.headerService.initState();
      }
    );
  }

  changeLang(lang: string) {
    const activeLang = Object.keys(LANGS).find((key) => LANGS[key] == lang) as string;
    this.open = false;
    this.translocoService.setActiveLang(activeLang);
    localStorage.setItem('lang', activeLang);
  }
}
