import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TuiActiveZoneDirective, TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';

import { NotificationItem } from '../notifications/notifications';
import { NotificationsService } from '../notifications/notifications.service';

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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly notificationsService: NotificationsService,
    private readonly destroy$: TuiDestroyService
  ) {}

  action(type: 'read' | 'remove'): void {
    this.open = false;
    this.notificationsService[type === 'read' ? 'markAsRead' : 'removeNotification'](this.item.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
