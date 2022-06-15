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

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  toPageNotification(item: NotificationItem): void {
    this.action('read');
    switch (item.type) {
      case NotificationItemType.OverviewMe:
        this.router.navigateByUrl('/overview/me');
        break;
      case NotificationItemType.SeatMap:
        if (item.targetId) {
          this.router.navigateByUrl(`/seat-maps/${item.targetId}`);
        } else {
          this.router.navigateByUrl('/seat-maps');
        }
        break;
      case NotificationItemType.KnowledgeBaseArticles:
        if (item.targetId) {
          this.router.navigateByUrl(`admin/knowledge-base/articles/${item.targetId}`);
        } else {
          this.router.navigateByUrl('admin/knowledge-base/articles');
        }
        break;
      case NotificationItemType.ProfileIndividual:
        this.router.navigateByUrl('/profile/individual');
        break;
      case NotificationItemType.Tenants:
        if (item.targetId) {
          this.router.navigateByUrl(`/admin/tenants/${item.targetId}/profile`);
        } else {
          this.router.navigateByUrl('/admin/tenants');
        }
        break;
      case NotificationItemType.OfficesList:
        this.router.navigateByUrl('admin/offices/list');
        break;
      case NotificationItemType.SeatMapEdit:
        if (item.targetId) {
          this.router.navigateByUrl(`/admin/seat-maps/${item.targetId}/edit`);
        } else {
          this.router.navigateByUrl('/admin/seat-maps');
        }
        break;
      case NotificationItemType.LeaveConfigLevelsApproval:
        this.router.navigateByUrl('admin/leave-configs/levels-approval');
        break;
      case NotificationItemType.LeaveConfigType:
        this.router.navigateByUrl('admin/leave-configs/types');
        break;
      case NotificationItemType.LeaveConfigEntitlements:
        this.router.navigateByUrl('admin/leave-configs/entitlements');
        break;
      case NotificationItemType.WorkingTimesConfiguration:
        this.router.navigateByUrl('/admin/working-times/configuration');
        break;
      default:
        throw new Error('Type Notification Invalid');
    }
  }
}
