import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, loadProfileGeneralInformation, ProfileGeneralQuery } from '@nexthcm/cdk';
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
  notification = 13;
  readonly languages: BaseOption<string>[] = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
  ];
  readonly userProfile$ = this.profileGeneralQuery.select();

  constructor(
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly profileGeneralQuery: ProfileGeneralQuery,
    private readonly actions: Actions,
    private readonly router: Router,
    @Inject(HEADER_TABS) readonly headerTabs: readonly MenuItem[]
  ) {
    this.actions.dispatch(loadProfileGeneralInformation());
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
