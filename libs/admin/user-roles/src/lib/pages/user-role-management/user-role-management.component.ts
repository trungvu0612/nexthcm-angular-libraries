import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, iif, Observable, of } from 'rxjs';
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
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_USER_ROLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminUserRolesService.getUserRoles(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<UserRole>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private adminUserRolesService: AdminUserRolesService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertUserRole(data?: UserRole): void {
    this.dialogService
      .open<UserRole>(new PolymorpheusComponent(UpsertUserRoleDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'userRoles.editUserRole' : 'userRoles.createUserRole'),
        size: 'l',
        data,
      })
      .pipe(
        switchMap((data) => this.adminUserRolesService.upsertUserRole(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
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
        switchMap((result) => iif(() => result.isConfirmed, this.adminUserRolesService.deleteAdminUserRoleId(id))),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('userRoles.deleteUserRoleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
