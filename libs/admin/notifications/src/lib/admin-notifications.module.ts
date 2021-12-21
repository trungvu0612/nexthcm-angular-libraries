import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UpsertNotificationComponent } from './components/upsert-notification/upsert-notification.component';
import { NotificationManagementComponent } from './pages/notification-management/notification-management.component';

export const adminNotificationsRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NotificationManagementComponent, UpsertNotificationComponent],
})
export class AdminNotificationsModule {}
