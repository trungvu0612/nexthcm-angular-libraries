import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem } from '../../../models/menu-item';

@Component({
  selector: 'hcm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  // @bad TODO remove TemplateRefs & temporary sub
  @ViewChild('myTimeTmp', { static: true }) myTimeTmp!: TemplateRef<any>;
  @ViewChild('adminTmp', { static: true }) adminTmp!: TemplateRef<any>;
  readonly myTimeSubmenu: MenuItem[] = [
    { label: 'leaveHistory', link: '/leave-history', permissions: 'VIEW_LEAVE_HISTORY' },
    { label: 'myRequest', link: '/my-time/my-request', permissions: 'VIEW_MY_REQUEST' },
    { label: 'workingHour', link: '/my-time/working-hour', permissions: 'VIEW_WORKING_HOUR' },
  ];
  readonly adminSubmenu: MenuItem[] = [
    {
      label: 'tenantManagement',
      link: '/admin/tenant',
      icon: 'tenant',
      permissions: 'TENANT',
    },
    {
      label: 'employeeManagement',
      link: '/admin/employees',
      icon: 'employee',
      permissions: 'EMPLOYEE',
    },
    {
      label: 'roleManagement',
      link: '/admin/user-roles',
      icon: 'user-role',
      permissions: 'ROLE',
    },
    {
      label: 'permissionManagement',
      link: '/admin/permissions',
      icon: 'permission',
      permissions: 'PERMISSION',
    },
    {
      label: 'officeManagement',
      link: '/admin/offices',
      icon: 'office',
      permissions: 'OFFICE',
    },
    {
      label: 'seatMapManagement',
      link: '/admin/seat-maps',
      icon: 'seat-map',
      permissions: 'SEAT_MAP',
    },
    {
      label: 'knowledgeBaseManagement',
      link: '/admin/policies',
      icon: 'knowledge-base',
      permissions: 'ADMIN_KNOWLEDGE',
    },
    {
      label: 'jobLevelManagement',
      link: '/admin/job-level',
      icon: 'job-level',
      permissions: 'JOB_LEVEL',
    },
    {
      label: 'processManagement',
      link: '/admin/processes',
      icon: 'process',
      permissions: 'WORKFLOW',
    },
    {
      label: 'branchManagement',
      link: '/admin/branches',
      icon: 'branch',
      permissions: 'BRANCH',
    },
    {
      label: 'departmentManagement',
      link: '/admin/departments',
      icon: 'department',
      permissions: 'DEPARTMENT',
    },
    {
      label: 'jobTitleManagement',
      link: '/admin/job-titles',
      icon: 'job-title',
      permissions: 'JOB_TITLE',
    },
    {
      label: 'entitlementManagement',
      link: '/admin/entitlements',
      icon: 'entitlement',
      permissions: 'ALLOWANCE_TYPE',
    },
    {
      label: 'leaveTypeManagement',
      link: '/admin/leave-types',
      icon: 'leave-type',
      permissions: 'LEAVE_TYPE',
    },
    {
      label: 'workingTimeManagement',
      link: '/admin/working-times',
      icon: 'working-time',
      permissions: 'ADMIN_WORKING_TIME',
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
        children: [
          { label: 'leaveHistory', link: '/leave-history', permissions: 'VIEW_LEAVE_HISTORY' },
          { label: 'myRequest', link: '/my-time/my-request', permissions: 'VIEW_MY_REQUEST' },
          { label: 'workingHour', link: '/my-time/working-hour', permissions: 'VIEW_WORKING_HOUR' },
        ],
        // @bad TODO remove
        submenu: this.myTimeTmp,
      },
      {
        label: 'helpDesk',
        link: '/help-desk',
        icon: 'help-desk',
        permissions: 'HELP_DESK',
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
        link: '/policy',
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
            link: '/admin/tenant',
            icon: 'tenant',
            permissions: 'TENANT',
          },
          {
            label: 'employeeManagement',
            link: '/admin/employees',
            icon: 'employee',
            permissions: 'EMPLOYEE',
          },
          {
            label: 'roleManagement',
            link: '/admin/user-roles',
            icon: 'user-role',
            permissions: 'ROLE',
          },
          {
            label: 'permissionManagement',
            link: '/admin/permissions',
            icon: 'permission',
            permissions: 'PERMISSION',
          },
          {
            label: 'officeManagement',
            link: '/admin/offices',
            icon: 'office',
            permissions: 'OFFICE',
          },
          {
            label: 'seatMapManagement',
            link: '/admin/seat-maps',
            icon: 'seat-map',
            permissions: 'SEAT_MAP',
          },
          {
            label: 'knowledgeBaseManagement',
            link: '/admin/policies',
            icon: 'knowledge-base',
            permissions: 'ADMIN_KNOWLEDGE',
          },
          {
            label: 'jobLevelManagement',
            link: '/admin/job-level',
            icon: 'job-level',
            permissions: 'JOB_LEVEL',
          },
          {
            label: 'processManagement',
            link: '/admin/processes',
            icon: 'process',
            permissions: 'WORKFLOW',
          },
          {
            label: 'branchManagement',
            link: '/admin/branches',
            icon: 'branch',
            permissions: 'BRANCH',
          },
          {
            label: 'departmentManagement',
            link: '/admin/departments',
            icon: 'department',
            permissions: 'DEPARTMENT',
          },
          {
            label: 'jobTitleManagement',
            link: '/admin/job-titles',
            icon: 'job-title',
            permissions: 'JOB_TITLE',
          },
          {
            label: 'entitlementManagement',
            link: '/admin/entitlements',
            icon: 'entitlement',
            permissions: 'ALLOWANCE_TYPE',
          },
          {
            label: 'leaveTypeManagement',
            link: '/admin/leave-types',
            icon: 'leave-type',
            permissions: 'LEAVE_TYPE',
          },
          {
            label: 'workingTimeManagement',
            link: '/admin/working-times',
            icon: 'working-time',
            permissions: 'ADMIN_WORKING_TIME',
          },
        ],
        // @bad TODO remove
        submenu: this.adminTmp,
      },
    ];
  }
}
