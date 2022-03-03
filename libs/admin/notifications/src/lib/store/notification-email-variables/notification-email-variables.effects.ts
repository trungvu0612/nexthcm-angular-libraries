import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';

import { AdminNotificationsService } from '../../services/admin-notifications.service';
import { loadNotificationEmailVariables } from './notification-email-variables.action';
import { NotificationEmailVariablesStore } from './notification-email-variables.state';

@Injectable()
export class NotificationEmailVariablesEffects {
  @Effect()
  loadNotificationEmailVariables$ = this.actions$.pipe(
    ofType(loadNotificationEmailVariables),
    switchMap(() =>
      cacheable(
        this.store,
        this.adminNotificationsService.getNotificationEmailVariables().pipe(tap((data) => this.store.set(data)))
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminNotificationsService: AdminNotificationsService,
    private readonly store: NotificationEmailVariablesStore
  ) {}
}
