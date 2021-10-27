import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, takeUntil } from 'rxjs/operators';
import { MenuItem } from '../../../models';

const SCROLL_INTO_VIEW_DELAY = 200;

@Component({
  selector: 'hcm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SidebarComponent {
  openPagesArr: boolean[] = [];
  active = '';
  items: MenuItem[] = [
    {
      title: 'overview',
      route: '/overview',
      icon: 'overview',
      permissions: 'OVERVIEW',
    },
    {
      title: 'myTime',
      route: '/my-time',
      icon: 'my-time',
      permissions: 'MY_TIME',
    },
    {
      title: 'seatMaps',
      route: '/seat-maps',
      icon: 'seat-map',
      permissions: 'VIEW_SEAT',
    },
    {
      title: 'calendar',
      route: '/calendar',
      icon: 'calendar',
      permissions: 'CALENDAR',
    },
    /*{
      label: 'payslip',
      link: '/payslip',
      icon: 'payslip',
      permissions: 'PAYSLIP',
    },
    {
      label: 'report',
      link: '/report',
      icon: 'report',
      permissions: 'REPORT',
    },*/
    {
      title: 'humanResource',
      route: '/human-resource',
      icon: 'human-resource',
      permissions: 'HUMAN_RESOURCE',
    },
    /*{
      label: 'form',
      link: '/form',
      icon: 'form',
      permissions: 'FORM',
    },*/
    {
      title: 'knowledgeBase',
      route: '/knowledge-base',
      icon: 'knowledge-base',
      permissions: 'KNOWLEDGE_BASE',
    },
    {
      title: 'admin',
      route: '/admin',
      icon: 'admin',
      permissions: 'ADMIN',
      children: [
        {
          title: 'tenantManagement',
          route: '/admin/tenants',
          icon: 'tenant',
          permissions: 'VIEW_TENANT',
        },
        {
          title: 'employeeManagement',
          route: '/admin/employees',
          icon: 'employee',
          permissions: 'VIEW_EMPLOYEE',
        },
        {
          title: 'roleManagement',
          route: '/admin/user-roles',
          icon: 'user-role',
          permissions: 'VIEW_ROLE',
        },
        {
          title: 'permissionManagement',
          route: '/admin/permissions',
          icon: 'permission',
          permissions: 'VIEW_PERMISSION',
        },
        {
          title: 'officeManagement',
          route: '/admin/offices',
          icon: 'office',
          permissions: 'VIEW_OFFICE',
        },
        {
          title: 'seatMapManagement',
          route: '/admin/seat-maps',
          icon: 'seat-map',
          permissions: 'VIEW_SEAT_MAP',
        },
        {
          title: 'knowledgeBaseManagement',
          route: '/admin/knowledge-base',
          icon: 'knowledge-base',
          permissions: 'VIEW_ADMIN_KNOWLEDGE',
        },
        {
          title: 'jobLevelManagement',
          route: '/admin/job-levels',
          icon: 'job-level',
          permissions: 'VIEW_JOB_LEVEL',
        },
        {
          title: 'workflowManagement',
          route: '/admin/workflows',
          icon: 'workflows',
          permissions: 'VIEW_WORKFLOW',
        },
        {
          title: 'branchManagement',
          route: '/admin/branches',
          icon: 'branch',
          permissions: 'VIEW_BRANCH',
        },
        {
          title: 'jobTitleManagement',
          route: '/admin/job-titles',
          icon: 'job-title',
          permissions: 'VIEW_JOB_TITLE',
        },
        {
          title: 'leaveConfigurations',
          route: '/admin/leave-configs',
          icon: 'leave-configs',
          permissions: 'VIEW_LEAVE_CONFIG',
        },
        {
          title: 'requestsConfig',
          route: '/admin/requests-config',
          icon: 'requests-config',
          permissions: 'VIEW_REQUEST_CONFIG_MANAGEMENT',
        },
        {
          title: 'workingTimeManagement',
          route: '/admin/working-times',
          icon: 'working-time',
          permissions: 'VIEW_ADMIN_CONFIG_TIME',
        },
        {
          title: 'syncSetting',
          route: '/admin/synchronize-data',
          icon: 'working-time',
          permissions: 'VIEW_ADMIN_CONFIG_TIME',
        },
      ],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService,
    @Inject(DOCUMENT) private readonly documentRef: Document
  ) {
    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(isPresent),
        takeUntil(destroy$)
      )
      .subscribe(() => {
        this.openActivePageGroup();
        this.handleAnchorLink(this.activatedRoute.snapshot.fragment);
      });
  }

  private isActiveRoute(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  private handleAnchorLink(hash: string | null): void {
    setTimeout(() => {
      this.navigateToAnchorLink(hash);
    }, SCROLL_INTO_VIEW_DELAY);
  }

  private openActivePageGroup(): void {
    this.items.forEach((item, index) => {
      if (this.isActiveRoute(item.route)) {
        this.openPagesArr[index] = true;
        this.active = item.route;
      }
    });
  }

  private navigateToAnchorLink(fragment: string | null): void {
    const element = fragment && this.documentRef.querySelector(`#${fragment}`);

    if (!element) {
      return;
    }

    element.classList.add('hcm-animated');
    element.scrollIntoView({
      block: 'start',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }
}
