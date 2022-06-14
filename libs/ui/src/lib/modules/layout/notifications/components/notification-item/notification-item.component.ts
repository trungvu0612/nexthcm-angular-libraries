import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';

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
  toPageNotification(item: any): void {
    switch (item.type) {
      case 2:
        this.router.navigateByUrl('/overview/me');
        break;
      case 4:
        if (item.targetId) {
          this.router.navigateByUrl(`/seat-maps/${item.targetId}`);
        } else {
          this.router.navigateByUrl('/seat-maps');
        }
        break;
      case 5:
        if (item.targetId) {
          this.router.navigateByUrl(`admin/knowledge-base/articles/${item.targetId}`);
        } else {
          this.router.navigateByUrl('admin/knowledge-base/articles');
        }
        break;
      case 16:
        this.router.navigateByUrl('/profile/individual');
        break;
      case 17:
        if (item.targetId) {
          this.router.navigateByUrl(`/admin/tenants/${item.targetId}/profile`);
        } else {
          this.router.navigateByUrl('/admin/tenants');
        }
        break;
      case 18:
        this.router.navigateByUrl('admin/offices/list');
        break;
      case 19:
        if (item.targetId) {
          this.router.navigateByUrl(`/admin/seat-maps/${item.targetId}/edit`);
        } else {
          this.router.navigateByUrl('/admin/seat-maps');
        }
        break;
      case 21:
        this.router.navigateByUrl('admin/leave-configs/levels-approval');
        break;
      case 22:
        this.router.navigateByUrl('admin/leave-configs/types');
        break;
      case 24:
        this.router.navigateByUrl('admin/leave-configs/entitlements');
        break;
      case 26:
        this.router.navigateByUrl('/admin/working-times/configuration');
        break;
      default:
        throw new Error('Type Notification Invalid');
    }
  }
}
