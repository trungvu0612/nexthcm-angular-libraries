import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { UpsertUserRoleDialogComponent } from '../../components/upsert-user-roles/upsert-user-role-dialog.component';
import { UserRole } from '../../models/user-role';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';

@Component({
  selector: 'hcm-user-role-management',
  templateUrl: './user-role-management.component.html',
  styleUrls: ['./user-role-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class UserRoleManagementComponent extends AbstractServerSortPaginationTableComponent<UserRole> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_USER_ROLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminUserRolesService.getUserRoles(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<UserRole>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private adminUserRolesService: AdminUserRolesService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertUserRole(data?: UserRole): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertUserRoleDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'userRoles.editUserRole' : 'userRoles.createUserRole'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveUserRole(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('userRoles.deleteUserRole'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.adminUserRolesService.deleteAdminUserRoleId(id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse('userRoles.deleteUserRoleSuccessfully', () => this.fetch$.next()));
  }
}
