import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { NewAbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, map, share, startWith, switchMap } from 'rxjs/operators';

import { NotificationItem } from '../../models/notification-item';
import { AdminNotificationsService } from '../../services/admin-notifications.service';

@Component({
  selector: 'hcm-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class NotificationManagementComponent extends NewAbstractServerSortPaginationTableComponent<NotificationItem> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EMPLOYEE_MANAGEMENT_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'organization', title: result.department },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'directReport', title: result.directReport },
        { key: 'roles', title: result.roles },
        { key: 'status', title: result.activeStatus },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminNotificationsService.getNotifications(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false)),
    startWith(true)
  );

  constructor(
    readonly state: RxState<Pagination<NotificationItem>>,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly adminNotificationsService: AdminNotificationsService,
    private readonly translocoService: TranslocoService
  ) {
    super(state, activatedRoute);
  }
}
