import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import { loadProfileGeneralInformation, ProfileGeneralQuery } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { filter, map } from 'rxjs/operators';

const LANGS: { [key: string]: string } = { en: 'English', vi: 'Tiếng Việt' };

const TABS = [
  {
    root: 'admin/tenant',
    exclude: 'create',
    tabs: [
      { path: 'detail', tabName: 'information' },
      { path: 'domain', tabName: 'domain' },
      { path: 'organizational-structure', tabName: 'organizationalStructure' },
      { path: 'organizational-chart', tabName: 'organizationalChart' },
    ],
  },
  {
    root: 'admin/leave-configs',
    tabs: [
      { path: 'leave-type', tabName: 'leaveType' },
      { path: 'leave-period', tabName: 'leavePeriod' },
      { path: 'leave-entitlement', tabName: 'leaveEntitlement' },
      { path: 'leave-level-approve', tabName: 'leaveLeveApprove' },
    ],
  },
  {
    root: 'my-time',
    tabs: [
      { path: 'my-leave', tabName: 'myLeave' },
      { path: 'working-hours', tabName: 'workingHours' },
      { path: 'my-requests', tabName: 'myRequest' },
      { path: 'requests', tabName: 'requestManagement' },
    ],
  },
  {
    root: 'human-resource',
    tabs: [
      { path: 'organization-chart', tabName: 'organizationChart' },
      { path: 'employees', tabName: 'employees' },
    ],
  },
  {
    root: 'knowledge-base',
    tabs: [
      { path: 'summary', tabName: 'knowledgeBase' },
      { path: 'updated', tabName: 'updated' },
      { path: 'category', tabName: 'category' },
    ],
  },
  {
    root: 'admin/workflows',
    tabs: [
      { path: '', tabName: 'workflows' },
      { path: 'email-templates', tabName: 'email-templates' },
    ],
  },
];

@Component({
  selector: 'hcm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class HeaderComponent {
  open = false;
  notification = 13;
  readonly languages = (this.translocoService.getAvailableLangs() as string[]).map((lang) => LANGS[lang]);
  readonly tabs$ = this.state.select('tabs');
  readonly userProfile$ = this.profileGeneralQuery.select();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly state: RxState<any>,
    private readonly profileGeneralQuery: ProfileGeneralQuery,
    private readonly actions: Actions
  ) {
    this.state.set({ root: '', tabs: [] });
    this.state.connect(
      this.router.events.pipe(
        filter((e: any) => e instanceof NavigationEnd),
        map((event) => {
          const index = TABS.findIndex((item) => {
            const checkHas = new RegExp('^/' + item.root).test(event.urlAfterRedirects);
            if (item.exclude)
              return checkHas && !new RegExp('^/' + item.root + item.exclude).test(event.urlAfterRedirects);
            return checkHas;
          });
          if (index > -1) return TABS[index];
          return { root: '', tabs: [] };
        })
      )
    );
    this.actions.dispatch(loadProfileGeneralInformation());
  }

  changeLang(lang: string) {
    const activeLang = Object.keys(LANGS).find((key) => LANGS[key] == lang) as string;
    this.open = false;
    this.translocoService.setActiveLang(activeLang);
    localStorage.setItem('lang', activeLang);
  }
}
