import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, UserProfileService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';

import { MenuItem } from '../../../models';
import { HEADER_TABS } from '../../../tokens';

@Component({
  selector: 'hcm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  open = false;
  readonly languages: BaseOption<string>[] = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
  ];
  readonly userProfile$ = this.userProfileService.general$;

  constructor(
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    @Inject(HEADER_TABS) readonly headerTabs: ReadonlyArray<MenuItem>,
    private readonly userProfileService: UserProfileService
  ) {
    userProfileService.doLoadGeneralInformation();
  }

  changeLang(lang: string) {
    this.open = false;
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
