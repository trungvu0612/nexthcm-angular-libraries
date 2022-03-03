import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { CommonStatus, NewAbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { NotificationType } from '../../enums/notification-type';
import { NotificationItem } from '../../models/notification-item';
import { AdminNotificationsService } from '../../services/admin-notifications.service';

@Component({
  selector: 'hcm-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class NotificationManagementComponent
  extends NewAbstractServerSortPaginationTableComponent<NotificationItem>
  implements OnInit
{
  @ViewChild('allRolesTpl', { static: true }) allRolesTpl!: TemplateRef<unknown>;
  @ViewChild('rolesTpl', { static: true }) rolesTpl!: TemplateRef<unknown>;
  @ViewChild('typeTpl', { static: true }) typeTpl!: TemplateRef<unknown>;
  @ViewChild('featuredTpl', { static: true }) featuredTpl!: TemplateRef<unknown>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<unknown>;
  @ViewChild('functionsTpl', { static: true }) functionsTpl!: TemplateRef<unknown>;

  columns$!: Observable<Columns[]>;
  readonly CommonStatus = CommonStatus;
  readonly NotificationType = NotificationType;
  readonly search$ = new Subject<string | null>();
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly injector: Injector,
    private readonly adminNotificationsService: AdminNotificationsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService
  ) {
    super(state, activatedRoute);
  }

  ngOnInit(): void {
    this.columns$ = this.translocoService
      .selectTranslateObject('ADMIN_NOTIFICATION_COLUMNS', {}, this.translocoScope.scope)
      .pipe(
        map((result) => [
          { key: 'title', title: result.title, orderEnabled: false },
          { key: 'description', title: result.description, orderEnabled: false },
          { key: 'isAllRole', title: result.allRole, orderEnabled: false, cellTemplate: this.allRolesTpl },
          { key: 'roles', title: result.roles, orderEnabled: false, cellTemplate: this.rolesTpl },
          { key: 'type', title: result.type, orderEnabled: false, cellTemplate: this.typeTpl },
          { key: 'top', title: result.featured, orderEnabled: false, cellTemplate: this.featuredTpl },
          { key: 'status', title: result.status, orderEnabled: false, cellTemplate: this.statusTpl },
          { key: '', title: result.functions, orderEnabled: false, cellTemplate: this.functionsTpl },
        ])
      );
  }

  onDelete(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(this.translocoScope.scope + '.deleteNotification'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.adminNotificationsService.deleteNotification(id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(this.translocoScope.scope + '.deleteNotificationSuccessfully', () =>
          this.fetch$.next()
        )
      );
  }
}
