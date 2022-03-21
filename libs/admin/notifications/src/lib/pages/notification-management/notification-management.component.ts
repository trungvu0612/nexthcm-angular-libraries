import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSerializer } from '@angular/router';
import {
  AbstractServerSortPaginationTableComponent,
  BaseOption,
  CommonStatus,
  Pagination,
  PromptService,
  RolesService,
} from '@nexthcm/cdk';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiContextWithImplicit, TuiDestroyService, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import omit from 'just-omit';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

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
  extends AbstractServerSortPaginationTableComponent<NotificationItem>
  implements OnInit
{
  columns$!: Observable<Columns[]>;
  rolesFilter: string[] = [];
  readonly CommonStatus = CommonStatus;
  readonly NotificationType = NotificationType;
  readonly search$ = new Subject<string | null>();
  readonly roleIds$ = new Subject<string>();
  readonly typeFilter$ = new Subject<NotificationType | null>();
  readonly statusFilter$ = new Subject<CommonStatus | null>();
  readonly types$: Observable<BaseOption<NotificationType>[]> = this.translocoService
    .selectTranslateObject('NOTIFICATION_TYPES', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { value: NotificationType.Common, label: result.common },
        { value: NotificationType.Birthday, label: result.birthday },
      ])
    );
  readonly statusList$: Observable<BaseOption<CommonStatus>[]> = this.translocoService
    .selectTranslateObject('COMMON_STATUS')
    .pipe(
      map((result) => [
        { value: CommonStatus.active, label: result.active },
        { value: CommonStatus.inactive, label: result.inactive },
      ])
    );
  readonly rolesList$ = this.rolesService.roles$;
  readonly rolesStringify$ = this.rolesList$.pipe(
    map((roles) => new Map(roles.map<[string, string]>(({ id, name }) => [id, name]))),
    startWith(new Map()),
    map(
      (map) => (id: string | TuiContextWithImplicit<string>) =>
        typeof id === 'string' ? map.get(id) : map.get(id.$implicit)
    )
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
    override readonly state: RxState<Pagination<NotificationItem>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly injector: Injector,
    private readonly adminNotificationsService: AdminNotificationsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly rolesService: RolesService
  ) {
    super(state, activatedRoute);
    rolesService.doLoadRoles();
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchQuery) => {
          this.resetPage();
          if (searchQuery) {
            this.queryParams = this.queryParams.set('search', searchQuery);
          } else {
            this.setQueryParams('search', null);
            this.queryParams = this.queryParams.delete('search');
          }
          this.fetch$.next();
        })
      )
    );
    state.hold(this.statusFilter$, (status) => {
      this.resetPage();
      this.onFilter('status', status);
    });
    state.hold(this.typeFilter$, (type) => {
      this.resetPage();
      this.onFilter('type', type);
    });
    state.hold(this.roleIds$, (roleIds) => {
      this.resetPage();
      this.onFilter('roleIds', roleIds);
    });
  }

  ngOnInit(): void {
    this.columns$ = this.translocoService
      .selectTranslateObject('ADMIN_NOTIFICATION_COLUMNS', {}, this.translocoScope.scope)
      .pipe(
        map((result) => [
          { key: 'title', title: result.title, orderEnabled: false },
          { key: 'description', title: result.description, orderEnabled: false },
          {
            key: 'isAllRole',
            title: result.allRole,
            cssClass: { name: 'text-center', includeHeader: true },
            orderEnabled: false,
          },
          { key: 'roles', title: result.roles, orderEnabled: false },
          { key: 'type', title: result.type, orderEnabled: false },
          {
            key: 'top',
            title: result.featured,
            cssClass: { name: 'text-center', includeHeader: true },
            orderEnabled: false,
          },
          { key: 'status', title: result.status, orderEnabled: false },
          { key: '', title: result.functions, orderEnabled: false },
        ])
      );
  }

  @tuiPure
  typeStringify(
    items: ReadonlyArray<BaseOption<NotificationType>>
  ): TuiStringHandler<TuiContextWithImplicit<NotificationType>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<NotificationType>) => map.get($implicit) || '';
  }

  @tuiPure
  statusStringify(
    items: ReadonlyArray<BaseOption<CommonStatus>>
  ): TuiStringHandler<TuiContextWithImplicit<CommonStatus>> {
    const map = new Map(items.map(({ value, label }) => [value, label]));

    return ({ $implicit }: TuiContextWithImplicit<CommonStatus>) => map.get($implicit) || '';
  }

  override parseParams(params: Params): void {
    const keys = ['search', 'type', 'roleIds', 'status'];

    super.parseParams(params);
    for (const key of keys) {
      this.queryParams =
        params[key] && params[key] !== 'null' ? this.queryParams.set(key, params[key]) : this.queryParams.delete(key);
    }
    if (params['roleIds']) {
      this.rolesFilter = params['roleIds'].split(',');
    }
  }

  onDelete(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.deleteNotification`),
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
        this.promptService.handleResponse(`${this.translocoScope.scope}.deleteNotificationSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }

  onFilter(key: string, value: string | number | null): void {
    this.queryParams = value !== null && value !== '' ? this.queryParams.set(key, value) : this.queryParams.delete(key);
    this.fetch$.next();
  }

  onRolesFilterChange(rolesFilter: string[]): void {
    const roleIds = rolesFilter.join(',');
    const tree = this.urlSerializer.parse(this.locationRef.path());

    tree.queryParams = rolesFilter.length ? { ...tree.queryParams, roleIds } : omit(tree.queryParams, 'roleIds');
    this.locationRef.go(String(tree));
    this.roleIds$.next(roleIds);
  }
}
