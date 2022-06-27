import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationItem, NotificationsService, NotificationType } from '@nexthcm/cdk';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class NotificationItemComponent {
  @Input() activeZone!: TuiActiveZoneDirective;
  @Input() item!: NotificationItem;
  open = false;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router
  ) {}

  action(type: 'read' | 'remove'): Observable<unknown> {
    this.open = false;
    return this.notificationsService[type === 'read' ? 'markAsRead' : 'removeNotification'](
      this.item.notificationId
    ).pipe(takeUntil(this.destroy$));
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  toPageNotification({ type, targetId }: NotificationItem): void {
    this.action('read').subscribe(() => {
      switch (type) {
        case NotificationType.OverviewMe:
          void this.router.navigateByUrl('/overview/me');
          break;
        case NotificationType.SeatMap:
          this.router.navigateByUrl(`/seat-maps${targetId ? `/${targetId}` : ''}`);
          break;
        case NotificationType.KnowledgeBaseArticles:
          this.router.navigateByUrl(`/knowledge-base/articles${targetId ? `/${targetId}` : ''}`);
          break;
        case NotificationType.Tenants:
          this.router.navigateByUrl(`/admin/tenants`);
          break;
        case NotificationType.OfficesList:
          this.router.navigateByUrl('/admin/offices/list');
          break;
        case NotificationType.SeatMapEdit:
          this.router.navigateByUrl(`/admin/seat-maps`);
          break;
        case NotificationType.LeaveConfigLevelsApproval:
          this.router.navigateByUrl('/admin/leave-configs/levels-approval');
          break;
        case NotificationType.LeaveConfigType:
          this.router.navigateByUrl('/admin/leave-configs/types');
          break;
        case NotificationType.LeaveConfigEntitlements:
          this.router.navigateByUrl('/admin/leave-configs/entitlements');
          break;
        case NotificationType.Permission:
          this.router.navigateByUrl(`/admin/permissions`);
          break;
        case NotificationType.AdminWorkFromHome:
          this.router.navigateByUrl(`/my-time/requests/work-from-home${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.AdminLeave:
          this.router.navigateByUrl(`/my-time/requests/leave${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.AdminWorkingAfterHouse:
          this.router.navigateByUrl(`/my-time/requests/working-after-hours${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.AdminUpdateTimesheet:
          this.router.navigateByUrl(`/my-time/requests/update-timesheet${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.AdminWorkingOnsite:
          this.router.navigateByUrl(`/my-time/requests/working-onsite${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.EmployeeWorkFromHome:
          this.router.navigateByUrl(`/my-time/my-requests/work-from-home${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.EmployeeLeave:
          this.router.navigateByUrl(`/my-time/my-leave${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.EmployeeWorkingAfterHouse:
          this.router.navigateByUrl(`/my-time/my-requests/working-after-hours${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.EmployeeUpdateTimesheet:
          this.router.navigateByUrl(`/my-time/my-requests/update-timesheet${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.EmployeeWorkingOnsite:
          this.router.navigateByUrl(`/my-time/my-requests/working-onsite${targetId ? `?id=${targetId}` : ''}`);
          break;
        case NotificationType.WorkingTimesConfiguration:
          this.router.navigateByUrl(`overview/me`);
          break;
        case NotificationType.NotificationAdHoc:
          this.router.navigateByUrl(`admin/notifications/management`);
          break;
        default:
          throw new Error('Type Notification Invalid');
      }
    });
  }
}
