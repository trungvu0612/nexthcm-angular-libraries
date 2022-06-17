import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';

import { NotificationItemType } from '../../enums/notification-item-type';
import { NotificationItem } from '../../models/notifications';
import { NotificationsService } from '../../services/notifications.service';

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

  action(type: 'read' | 'remove'): void {
    this.open = false;
    this.notificationsService[type === 'read' ? 'markAsRead' : 'removeNotification'](this.item.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  toPageNotification({ type, targetId }: NotificationItem): void {
    this.action('read');
    switch (type) {
      case NotificationItemType.OverviewMe:
        void this.router.navigateByUrl('/overview/me');
        break;
      case NotificationItemType.SeatMap:
        this.router.navigateByUrl(`/seat-maps${targetId ? `/${targetId}` : ''}`);
        break;
      case NotificationItemType.KnowledgeBaseArticles:
        if (targetId) {
          this.router.navigateByUrl(`/admin/knowledge-base/articles/${targetId}/edit`);
        } else {
          this.router.navigateByUrl('/profile/individual');
        }
        break;
      case NotificationItemType.Tenants:
        this.router.navigateByUrl(`/admin/tenants${targetId ? `/${targetId}/profile` : ''}`);
        break;
      case NotificationItemType.OfficesList:
        this.router.navigateByUrl('/admin/offices/list');
        break;
      case NotificationItemType.SeatMapEdit:
        this.router.navigateByUrl(`/admin/seat-maps${targetId ? `/${targetId}/edit` : ''}`);
        break;
      case NotificationItemType.LeaveConfigLevelsApproval:
        if (targetId) {
          this.router.navigate(['/admin/leave-configs/levels-approval'], {
            queryParams: { leaveLevelApprovalId: targetId },
          });
        } else {
          this.router.navigateByUrl('/admin/leave-configs/levels-approval');
        }
        break;
      case NotificationItemType.LeaveConfigType:
        if (targetId) {
          this.router.navigate(['/admin/leave-configs/types'], { queryParams: { leaveTypeId: targetId } });
        } else {
          this.router.navigateByUrl('/admin/leave-configs/types');
        }
        break;
      case NotificationItemType.LeaveConfigEntitlements:
        if (targetId) {
          this.router.navigate(['/admin/leave-configs/entitlements'], {
            queryParams: { leaveEntitlementId: targetId },
          });
        } else {
          this.router.navigateByUrl('/admin/leave-configs/entitlements');
        }
        break;
      case NotificationItemType.Permission:
        this.router.navigateByUrl(`/admin/permissions${targetId ? `/${targetId}` : ''}`);
        break;
      default:
        throw new Error('Type Notification Invalid');
    }
  }
}
