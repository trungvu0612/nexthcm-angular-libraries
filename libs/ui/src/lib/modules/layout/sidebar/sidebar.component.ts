import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem } from '../../../models';

@Component({
  selector: 'hcm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  // @bad TODO remove TemplateRefs & temporary submenu
  @ViewChild('adminTmp', { static: true }) adminTmp!: TemplateRef<any>;
  readonly adminSubmenu: MenuItem[] = [
    {
      label: 'tenantManagement',
      link: '/admin/tenants',
      icon: 'tenant',
      permissions: 'VIEW_TENANT',
    },
    {
      label: 'employeeManagement',
      link: '/admin/employees',
      icon: 'employee',
      permissions: 'VIEW_EMPLOYEE',
    },
    {
      label: 'roleManagement',
      link: '/admin/user-roles',
      icon: 'user-role',
      permissions: 'VIEW_ROLE',
    },
    {
      label: 'permissionManagement',
      link: '/admin/permissions',
      icon: 'permission',
      permissions: 'VIEW_PERMISSION',
    },
    {
      label: 'officeManagement',
      link: '/admin/offices',
      icon: 'office',
      permissions: 'VIEW_OFFICE',
    },
    {
      label: 'seatMapManagement',
      link: '/admin/seat-maps',
      icon: 'seat-map',
      permissions: 'VIEW_SEAT_MAP',
    },
    {
      label: 'knowledgeBaseManagement',
      link: '/admin/knowledge-base',
      icon: 'knowledge-base',
      permissions: 'VIEW_ADMIN_KNOWLEDGE',
    },
    {
      label: 'jobLevelManagement',
      link: '/admin/job-level',
      icon: 'job-level',
      permissions: 'VIEW_JOB_LEVEL',
    },
    {
      label: 'workflowManagement',
      link: '/admin/workflows',
      icon: 'workflows',
      permissions: 'VIEW_WORKFLOW',
    },
    {
      label: 'branchManagement',
      link: '/admin/branches',
      icon: 'branch',
      permissions: 'VIEW_BRANCH',
    },
    {
      label: 'jobTitleManagement',
      link: '/admin/job-titles',
      icon: 'job-title',
      permissions: 'VIEW_JOB_TITLE',
    },
    {
      label: 'leaveConfigs',
      link: '/admin/leave-configs',
      icon: 'leave-configs',
      permissions: 'ADMIN', // TODO need fix
    },
    {
      label: 'requestsConfig',
      link: '/admin/requests-config',
      icon: 'requests-config',
      permissions: 'ADMIN', // TODO need fix
    },
    {
      label: 'workingTimeManagement',
      link: '/admin/working-times',
      icon: 'working-time',
      permissions: 'VIEW_ADMIN_CONFIG_TIME',
    },
  ];

  items!: MenuItem[];

  ngOnInit(): void {
    this.items = [
      {
        label: 'overview',
        link: '/overview',
        icon: 'overview',
        permissions: 'OVERVIEW',
      },
      {
        label: 'myTime',
        link: '/my-time',
        icon: 'my-time',
        permissions: 'MY_TIME',
      },
      {
        label: 'seatMaps',
        link: '/seat-maps',
        icon: 'seat-map',
        permissions: 'VIEW_HELP_DESK', // TODO need change
      },
      {
        label: 'calendar',
        link: '/calendar',
        icon: 'calendar',
        permissions: 'VIEW_CALENDAR',
      },
      {
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
      },
      {
        label: 'humanResource',
        link: '/human-resource',
        icon: 'human-resource',
        permissions: 'HUMAN_RESOURCE',
      },
      {
        label: 'form',
        link: '/form',
        icon: 'form',
        permissions: 'FORM',
      },
      {
        label: 'knowledgeBase',
        link: '/knowledge-base',
        icon: 'knowledge-base',
        permissions: 'KNOWLEDGE_BASE',
      },
      {
        label: 'admin',
        link: '/admin',
        icon: 'admin',
        permissions: 'ADMIN',
        children: [
          {
            label: 'tenantManagement',
            link: '/admin/tenants',
            icon: 'tenant',
            permissions: 'VIEW_TENANT',
          },
          {
            label: 'employeeManagement',
            link: '/admin/employees',
            icon: 'employee',
            permissions: 'VIEW_EMPLOYEE',
          },
          {
            label: 'roleManagement',
            link: '/admin/user-roles',
            icon: 'user-role',
            permissions: 'VIEW_ROLE',
          },
          {
            label: 'permissionManagement',
            link: '/admin/permissions',
            icon: 'permission',
            permissions: 'VIEW_PERMISSION',
          },
          {
            label: 'officeManagement',
            link: '/admin/offices',
            icon: 'office',
            permissions: 'VIEW_OFFICE',
          },
          {
            label: 'seatMapManagement',
            link: '/admin/seat-maps',
            icon: 'seat-map',
            permissions: 'VIEW_SEAT_MAP',
          },
          {
            label: 'knowledgeBaseManagement',
            link: '/admin/knowledge-base',
            icon: 'knowledge-base',
            permissions: 'VIEW_ADMIN_KNOWLEDGE',
          },
          {
            label: 'jobLevelManagement',
            link: '/admin/job-level',
            icon: 'job-level',
            permissions: 'VIEW_JOB_LEVEL',
          },
          {
            label: 'workflowManagement',
            link: '/admin/workflows',
            icon: 'workflows',
            permissions: 'VIEW_WORKFLOW',
          },
          {
            label: 'branchManagement',
            link: '/admin/branches',
            icon: 'branch',
            permissions: 'VIEW_BRANCH',
          },
          {
            label: 'jobTitleManagement',
            link: '/admin/job-titles',
            icon: 'job-title',
            permissions: 'VIEW_JOB_TITLE',
          },
          {
            label: 'leaveConfigs',
            link: '/admin/leave-configs',
            icon: 'leave-configs',
            permissions: 'ADMIN', // TODO need fix
          },
          {
            label: 'requestsConfig',
            link: '/admin/requests-config',
            icon: 'requests-config',
            permissions: 'ADMIN', // TODO need fix
          },
          {
            label: 'workingTimeManagement',
            link: '/admin/working-times',
            icon: 'working-time',
            permissions: 'VIEW_ADMIN_CONFIG_TIME',
          },
        ],
        submenu: this.adminTmp, // @bad TODO remove
      },
    ];
  }
}
